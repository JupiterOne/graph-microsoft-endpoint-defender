import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DefenderClient } from '../clients/defenderClient';

import {
  DATA_ACCOUNT_ENTITY,
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
  const graphClient = new DefenderClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(DATA_ACCOUNT_ENTITY);
  if (!accountEntity) {
    logger.warn('Error fetching machine data: accountEntity does not exist');
    return;
  }
  await graphClient.iterateMachines(async (machine) => {
    const machineEntity = createMachineEntity(machine);
    await jobState.addEntity(machineEntity);
    await jobState.addRelationship(
      createAccountMachineRelationship(accountEntity, machineEntity),
    );
  });
}

export async function buildMachineManagesDevicesRelationships(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { jobState } = executionContext;

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
