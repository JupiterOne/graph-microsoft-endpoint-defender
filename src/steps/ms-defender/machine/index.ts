import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DefenderClient } from '../client';
import {
  ACCOUNT_ENTITY_KEY,
  Entities,
  Relationships,
  Steps,
} from '../../../constants';
import {
  createMachineEntity,
  createAccountMachineRelationship,
} from './converters';

export async function fetchMachines({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DefenderClient(logger, instance.config);

  const accountEntity = (await jobState.getData<Entity>(
    ACCOUNT_ENTITY_KEY,
  )) as Entity;

  await graphClient.iterateMachines(async (machine) => {
    const machineEntity = await jobState.addEntity(
      createMachineEntity(machine),
    );

    await jobState.addRelationship(
      createAccountMachineRelationship({ accountEntity, machineEntity }),
    );
  });
}

export const machineSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: Steps.FETCH_MACHINES.id,
    name: Steps.FETCH_MACHINES.name,
    entities: [Entities.MACHINE],
    relationships: [Relationships.ACCOUNT_HAS_MACHINE],
    dependsOn: [Steps.FETCH_ACCOUNT.id],
    executionHandler: fetchMachines,
  },
];
