import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { DirectoryGraphClient } from './clients/directoryClient';
import { DATA_ACCOUNT_ENTITY, entities, steps } from './constants';
import { createAccountEntityWithOrganization } from './converters';

export * from './constants';

export async function fetchAccount(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const organization = await graphClient.fetchOrganization();

  const accountEntity = createAccountEntityWithOrganization(
    instance,
    organization,
  );
  await jobState.addEntity(accountEntity);
  await jobState.setData(DATA_ACCOUNT_ENTITY, accountEntity);
}

export const activeDirectorySteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_ACCOUNT,
    name: 'Active Directory Info',
    entities: [entities.ACCOUNT],
    relationships: [],
    executionHandler: fetchAccount,
  },
];
