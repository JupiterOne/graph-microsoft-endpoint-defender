import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DirectoryGraphClient } from '../../active-directory/clients/directoryClient';

import {
  DATA_ACCOUNT_ENTITY,
  DATA_MACHINE_ENTITY,
  entities,
  MappedRelationships,
  relationships,
  steps,
  TargetEntities,
} from '../constants';
import {
  createMachineEntity,
  createMachinesDeviceRelationship,
  createAccountMachineRelationship,
} from './converters';

import { steps as activeDirectorySteps } from '../../active-directory/constants';

export async function fetchMachines(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  instance.config.isDefenderApi = true;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(DATA_ACCOUNT_ENTITY);
  if (!accountEntity) {
    logger.warn('Error fetching machine data: accountEntity does not exist');
    return;
  }
  await graphClient.iterateMachines(async (machine) => {
    const machineEntity = createMachineEntity(machine);
    await jobState.addEntity(machineEntity);
    await jobState.setData(DATA_MACHINE_ENTITY, machineEntity);
    await jobState.addRelationship(
      createAccountMachineRelationship(accountEntity, machineEntity),
    );
  });
}

export async function buildMachineManagesDevicesRelationships(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, jobState } = executionContext;

  const dataMachineEntity = await jobState.getData<Entity>(DATA_MACHINE_ENTITY);
  if (!dataMachineEntity) {
    logger.warn(
      'Error mapping machine to user endpoint: Machine Entity does not exist',
    );
    return;
  }

  await jobState.iterateEntities(
    { _type: entities.MACHINE._type },
    async (machine) => {
      await jobState.addRelationship(createMachinesDeviceRelationship(machine));
    },
  );
}

export const deviceSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_MACHINE,
    name: 'Microsoft Defender Machines',
    entities: [entities.MACHINE],
    relationships: [relationships.ACCOUNT_HAS_MACHINE],
    dependsOn: [activeDirectorySteps.FETCH_ACCOUNT],
    executionHandler: fetchMachines,
  },
  {
    id: steps.MACHINE_DEVICE_RELATIONSHIP,
    name: 'Machine manages devices relationship',
    entities: [TargetEntities.DEVICE],
    relationships: [],
    mappedRelationships: [MappedRelationships.MACHINE_MANAGES_DEVICE],
    dependsOn: [steps.FETCH_MACHINE],
    executionHandler: buildMachineManagesDevicesRelationships,
  },
];
