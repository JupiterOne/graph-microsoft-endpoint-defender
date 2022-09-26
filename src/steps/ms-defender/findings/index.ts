import {
  getRawData,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { Finding, Machine } from '../../../types';
import { DefenderClient } from '../client';
import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../../../constants';
import {
  createFindingCveRelationship,
  createFindingEntity,
  createMachineFindingRelationship,
  createFindingKey,
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

      await graphClient.iterateFindings(
        { machineId: machine.id },
        async (finding) => {
          const findingEntity = createFindingEntity(finding);

          if (!jobState.hasKey(createFindingKey(finding.id))) {
            await jobState.addEntity(findingEntity);
          }

          await jobState.addRelationship(
            createMachineFindingRelationship({
              machineEntity,
              vulnerabilityEntity: findingEntity,
            }),
          );
        },
      );
    },
  );
}

export async function buildFindingCveRelationship({
  jobState,
  logger,
}: IntegrationStepContext): Promise<void> {
  await jobState.iterateEntities(
    { _type: Entities.FINDING._type },
    async (findingEntity) => {
      const finding = getRawData<Finding>(findingEntity);
      if (!finding) {
        logger.warn(
          { _key: findingEntity._key },
          'Could not get raw data for finding entity',
        );
        return;
      }

      await jobState.addRelationship(
        createFindingCveRelationship(findingEntity, finding),
      );
    },
  );
}

export const findingsSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: Steps.FETCH_FINDINGS.id,
    name: Steps.FETCH_FINDINGS.name,
    entities: [Entities.FINDING],
    relationships: [Relationships.MACHINE_IDENTIFIED_FINDING],
    dependsOn: [Steps.FETCH_MACHINES.id],
    executionHandler: fetchFindings,
  },
  {
    id: Steps.FINDING_CVE_RELATIONSHIP.id,
    name: Steps.FINDING_CVE_RELATIONSHIP.name,
    entities: [],
    relationships: [],
    mappedRelationships: [MappedRelationships.FINDING_IS_CVE],
    dependsOn: [Steps.FETCH_FINDINGS.id],
    executionHandler: buildFindingCveRelationship,
  },
];
