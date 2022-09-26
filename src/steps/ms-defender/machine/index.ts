import {
  Entity,
  getRawData,
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
  createEndpointEntity,
  createMachineEndpointRelationship,
} from './converters';
import { Machine } from '../../../types';

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

export async function fetchEndpoint({
  instance,
  jobState,
  logger,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DefenderClient(logger, instance.config);
  await jobState.iterateEntities(
    { _type: Entities.MACHINE._type },
    async (machineEntity) => {
      const machine = getRawData<Machine>(machineEntity);

      if (!machine) {
        logger.warn(
          { _key: machineEntity._key },
          'Could not get raw data for machine entity',
        );
        return;
      }

      const endpoint = await graphClient.fetchEndpointDetails(machine.id);
      if (endpoint) {
        const endpointEntity = await jobState.addEntity(
          createEndpointEntity(endpoint),
        );

        await jobState.addRelationship(
          createMachineEndpointRelationship({
            machineEntity,
            endpointEntity,
          }),
        );
      }
    },
  );
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
  {
    id: Steps.FETCH_ENDPOINTS.id,
    name: Steps.FETCH_ENDPOINTS.name,
    entities: [Entities.ENDPOINT],
    relationships: [Relationships.MACHINE_MANAGES_ENDPOINT],
    dependsOn: [Steps.FETCH_MACHINES.id],
    executionHandler: fetchEndpoint,
  },
];
