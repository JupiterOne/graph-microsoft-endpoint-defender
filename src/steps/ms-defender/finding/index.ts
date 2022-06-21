import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DirectoryGraphClient } from '../../active-directory/clients/directoryClient';

import {
  DATA_MACHINE_ENTITY,
  entities,
  MappedRelationships,
  relationships,
  steps,
  TargetEntities,
  DATA_FINDING_ENTITY,
} from '../constants';
import {
  createFindingsCveRelationship,
  createFindingEntity,
  createMachineFindingsRelationship,
} from './converters';

export * from '../constants';
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
          const findingEntity = createFindingEntity(finding, machineEntity);
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
export const findingSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
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
