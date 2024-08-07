import {
  getRawData,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { Vulnerability, Machine } from '../../../types';
import { DefenderClient } from '../client';
import {
  Entities,
  INGESTION_SOURCE_IDS,
  MappedRelationships,
  Relationships,
  Steps,
} from '../../../constants';
import {
  createVulnerabilityCveRelationship,
  createVulnerabilityEntity,
  createMachineVulnerabilityRelationship,
} from './converters';

export async function fetchFindings({
  logger,
  instance,
  jobState,
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

      await graphClient.iterateVulnerabilities(
        { machineId: machine.id },
        async (finding) => {
          const findingEntity = createVulnerabilityEntity(finding);

          if (jobState.hasKey(findingEntity._key)) return;

          await jobState.addEntity(findingEntity);
          await jobState.addRelationship(
            createMachineVulnerabilityRelationship({
              machineEntity,
              vulnerabilityEntity: findingEntity,
            }),
          );
        },
      );
    },
  );
}

export async function buildVulnerabilityCveRelationship({
  jobState,
  logger,
}: IntegrationStepContext): Promise<void> {
  await jobState.iterateEntities(
    { _type: Entities.VULNERABILITY._type },
    async (vulnerabilityEntity) => {
      const finding = getRawData<Vulnerability>(vulnerabilityEntity);
      if (!finding) {
        logger.warn(
          { _key: vulnerabilityEntity._key },
          'Could not get raw data for vulnerability entity',
        );
        return;
      }

      await jobState.addRelationship(
        createVulnerabilityCveRelationship(vulnerabilityEntity, finding),
      );
    },
  );
}

export const vulnerabilitiesSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: Steps.FETCH_VULNERABILITIES.id,
    name: Steps.FETCH_VULNERABILITIES.name,
    entities: [Entities.VULNERABILITY],
    relationships: [Relationships.MACHINE_IDENTIFIED_VULNERABILITY],
    dependsOn: [Steps.FETCH_MACHINES.id],
    ingestionSourceId: INGESTION_SOURCE_IDS.VULNERABILITIES,
    executionHandler: fetchFindings,
  },
  {
    id: Steps.VULNERABILITY_CVE_RELATIONSHIP.id,
    name: Steps.VULNERABILITY_CVE_RELATIONSHIP.name,
    entities: [],
    relationships: [],
    mappedRelationships: [MappedRelationships.VULNERABILITY_IS_CVE],
    dependsOn: [Steps.FETCH_VULNERABILITIES.id],
    executionHandler: buildVulnerabilityCveRelationship,
  },
];
