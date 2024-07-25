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
    const machineEntity = createMachineEntity(machine);

    if (jobState.hasKey(machineEntity._key)) return;

    const accountMachineRelationship = createAccountMachineRelationship({
      accountEntity,
      machineEntity,
    });

    await Promise.all([
      jobState.addEntity(machineEntity),
      jobState.addRelationship(accountMachineRelationship),
    ]);
  });
}

export async function fetchEndpoints({
  instance,
  jobState,
  logger,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DefenderClient(logger, instance.config);
  let numFailedEndpointDetails: number = 0;
  let numSuccessfulEndpointDetails: number = 0;
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

      try {
        const endpoint = await graphClient.fetchEndpointDetails(machine.id);
        if (endpoint) {
          const endpointEntity = createEndpointEntity(endpoint);

          if (jobState.hasKey(endpoint._key)) return;

          await jobState.addEntity(endpointEntity);

          await jobState.addRelationship(
            createMachineEndpointRelationship({
              machineEntity,
              endpointEntity,
            }),
          );
          numSuccessfulEndpointDetails++;
        }
      } catch (err) {
        logger.warn(
          { err },
          `Could not get endpoint details for machine entity ${machine.id}`,
        );
        numFailedEndpointDetails++;
      }
    },
  );

  if (numFailedEndpointDetails > 0) {
    logger.warn({
      message: `Unable to fetch all machine endpoint details (success=${numSuccessfulEndpointDetails}, failed=${numFailedEndpointDetails})`,
      code: 'ERROR_FETCH_ENDPOINT_DETAILS',
    });
  }
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
    executionHandler: fetchEndpoints,
  },
];
