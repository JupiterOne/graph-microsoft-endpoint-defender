import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  ACCOUNT_ENTITY_KEY,
  Entities,
  INGESTION_SOURCE_IDS,
  Relationships,
  Steps,
} from '../../constants';
import { ActiveDirectoryClient } from './client';
import {
  createAccountEntityWithOrganization,
  createAccountUserRelationship,
  createUserEntity,
} from './converters';

export async function fetchAccount({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new ActiveDirectoryClient(logger, instance.config);

  const organization = await graphClient.fetchOrganization();
  const accountEntity = createAccountEntityWithOrganization(
    instance,
    organization,
  );

  await jobState.addEntity(accountEntity);
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export async function fetchUsers({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new ActiveDirectoryClient(logger, instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await graphClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));

    await jobState.addRelationship(
      createAccountUserRelationship({ accountEntity, userEntity }),
    );
  });
}

export const activeDirectorySteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: Steps.FETCH_ACCOUNT.id,
    name: Steps.FETCH_ACCOUNT.name,
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
  {
    id: Steps.FETCH_USERS.id,
    name: Steps.FETCH_USERS.name,
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.FETCH_ACCOUNT.id],
    ingestionSourceId: INGESTION_SOURCE_IDS.USERS,
    executionHandler: fetchUsers,
  },
];
