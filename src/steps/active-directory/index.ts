import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { DirectoryGraphClient } from './clients/directoryClient';
import {
  DATA_ACCOUNT_ENTITY,
  DATA_FINDING_ENTITY,
  DATA_MACHINE_ENTITY,
  entities,
  MappedRelationships,
  relationships,
  steps,
  TargetEntities,
} from './constants';
import {
  createAccountEntityWithOrganization,
  createAccountMachineRelationship,
  createMachineUserRelationship,
  createMachineEntity,
  createUserEntity,
  createMachineFindingsRelationship,
  createFindingEntity,
  createFindingsCveRelationship,
  createMachinesDeviceRelationship,
} from './converters';

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

/*
  This method is to fetch machine data and mapping with the account
*/
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

/* Build MANAGES relation between machine to device 
Will throw warning if there is no machine data,
*/

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

/* To fetch users who logged into the machines and map them to machines */
export async function fetchLogonUsers(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  instance.config.isDefenderApi = true;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const dataMachineEntity = await jobState.getData<Entity>(DATA_MACHINE_ENTITY);
  if (!dataMachineEntity) {
    logger.warn('Error fetching users: machineEntity does not exist');
    return;
  }

  await jobState.iterateEntities(
    { _type: entities.MACHINE._type },
    async (machineEntity) => {
      await graphClient.iterateUsers(
        { machineId: machineEntity.id as string },
        async (user) => {
          const userEntity = createUserEntity(user);
          await jobState.addEntity(userEntity);
          await jobState.addRelationship(
            createMachineUserRelationship(machineEntity, userEntity),
          );
        },
      );
    },
  );
}

/* TO fetch vulnerability per machine and map them with the respective machine */
export async function fetchFindings(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  instance.config.isDefenderApi = true;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const dataMachineEntity = await jobState.getData<Entity>(DATA_MACHINE_ENTITY);
  if (!dataMachineEntity) {
    logger.warn('Error fetching findings: machineEntity does not exist');
    return;
  }

  await jobState.iterateEntities(
    { _type: entities.MACHINE._type },
    async (machineEntity) => {
      await graphClient.iterateFindings(
        { machineId: machineEntity.id as string },
        async (finding) => {
          const findingEntity = createFindingEntity(finding);
          await jobState.addEntity(findingEntity);
          await jobState.setData(DATA_FINDING_ENTITY, findingEntity);
          return await jobState.addRelationship(
            createMachineFindingsRelationship(machineEntity, findingEntity),
          );
        },
      );
    },
  );
}

/** To map whether the vulnerability IS a CVE */

export async function buildFindingIsCveRelationships(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, jobState } = executionContext;

  const dataFindingEntity = await jobState.getData<Entity>(DATA_FINDING_ENTITY);
  if (!dataFindingEntity) {
    logger.warn('Error mapping finding to CVE: FindingEntity does not exist');
    return;
  }

  await jobState.iterateEntities(
    { _type: entities.FINDING._type },
    async (findingEntity: any) => {
      if (findingEntity.id?.toString().toLowerCase().indexOf('cve') > -1) {
        await jobState.addRelationship(
          createFindingsCveRelationship(findingEntity),
        );
      }
    },
  );
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
  {
    id: steps.FETCH_MACHINE,
    name: 'Microsoft Defender Machines',
    entities: [entities.MACHINE],
    relationships: [relationships.ACCOUNT_HAS_MACHINE],
    dependsOn: [steps.FETCH_ACCOUNT],
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
  {
    id: steps.FETCH_USERS,
    name: 'Ms defender machine logged in Users',
    entities: [entities.USER],
    relationships: [
      relationships.ACCOUNT_HAS_MACHINE,
      relationships.MACHINE_HAS_USER,
    ],
    dependsOn: [steps.FETCH_MACHINE],
    executionHandler: fetchLogonUsers,
  },
  {
    id: steps.FETCH_FINDINGS,
    name: 'Ms defender machine findings',
    entities: [entities.FINDING],
    relationships: [
      relationships.ACCOUNT_HAS_MACHINE,
      relationships.MACHINE_IDENTIFIED_FINDING,
    ],
    dependsOn: [steps.FETCH_MACHINE],
    executionHandler: fetchFindings,
  },
  {
    id: steps.FINDING_VULNERABILITY_RELATIONSHIP,
    name: 'Defender finding Is CVE Vulnerability Relationships',
    entities: [TargetEntities.CVE],
    relationships: [],
    mappedRelationships: [MappedRelationships.FINDING_IS_CVE_VULNERABILITY],
    dependsOn: [steps.FETCH_FINDINGS],
    executionHandler: buildFindingIsCveRelationships,
  },
];
