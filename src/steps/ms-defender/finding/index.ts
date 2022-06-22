import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { Finding } from '../../../types';
import { DefenderClient } from '../clients/defenderClient';

import {
  entities,
  MappedRelationships,
  relationships,
  steps,
  TargetEntities,
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
  const graphClient = new DefenderClient(logger, instance.config);

  await jobState.iterateEntities(
    { _type: entities.MACHINE._type },
    async (machineEntity) => {
      await graphClient.iterateFindings(
        { machineId: machineEntity.id as string },
        async (finding) => {
          const findingEntity = createFindingEntity(finding, machineEntity);
          await jobState.addEntity(findingEntity);
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
  const { jobState } = executionContext;

  await jobState.iterateEntities<Finding>(
    { _type: entities.FINDING._type },
    async (findingEntity: Finding) => {
      if (findingEntity.id.toString().toLowerCase().indexOf('cve') > -1) {
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
    name: 'Fetch Vulnerability Findings',
    entities: [entities.FINDING],
    relationships: [
      relationships.ACCOUNT_HAS_MACHINE,
      relationships.MACHINE_IDENTIFIED_FINDING,
    ],
    dependsOn: [steps.FETCH_MACHINES],
    executionHandler: fetchFindings,
  },
  {
    id: steps.FINDING_VULNERABILITY_RELATIONSHIP,
    name: 'Build Finding CVE Relationships',
    entities: [TargetEntities.CVE],
    relationships: [],
    mappedRelationships: [MappedRelationships.FINDING_IS_CVE_VULNERABILITY],
    dependsOn: [steps.FETCH_FINDINGS],
    executionHandler: buildFindingIsCveRelationships,
  },
];
