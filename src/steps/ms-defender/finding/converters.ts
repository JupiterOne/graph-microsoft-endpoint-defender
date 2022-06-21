import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  createMappedRelationship,
  getTime,
} from '@jupiterone/integration-sdk-core';
import { Finding } from '../../../types';
import { entities, MappedRelationships, TargetEntities } from '../constants';

const SEVERITY_TO_NUMERIC_SEVERITY_MAP = new Map<string, number>([
  ['low', 2],
  ['medium', 5],
  ['high', 7],
  ['critical', 10],
]);

export function getNumericSeverityFromIssueSeverity(
  issueSeverity?: 'low' | 'medium' | 'high' | 'critical',
): number {
  if (!issueSeverity) return 0;

  const numericSeverity = SEVERITY_TO_NUMERIC_SEVERITY_MAP.get(issueSeverity);
  return numericSeverity === undefined ? 0 : numericSeverity;
}

export function createFindingEntity(
  defenderFinding: Finding,
  machineEntity,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        id: defenderFinding.id,
        _type: entities.FINDING._type,
        _class: entities.FINDING._class,
        _key: defenderFinding.id + '_' + machineEntity.id,
        name: defenderFinding.name,
        displayName: defenderFinding.name,
        description: defenderFinding.description,
        severity: defenderFinding.severity,
        score: defenderFinding.cvssV3,
        numericSeverity: getNumericSeverityFromIssueSeverity(
          defenderFinding.severity.toLowerCase(),
        ),
        publishedOn: defenderFinding.publishedOn,
        updatedOn: getTime(defenderFinding.updatedOn),
        category: '',
        open: true,
        references: defenderFinding.exploitUris,
        exposedMachines: defenderFinding.exposedMachines,
      },
    },
  });
}

export function createFindingsCveRelationship(
  findingEntity: Entity,
): Relationship {
  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.FINDING_IS_CVE_VULNERABILITY._type,
    _mapping: {
      sourceEntityKey: findingEntity._key,
      relationshipDirection:
        MappedRelationships.FINDING_IS_CVE_VULNERABILITY.direction,
      targetFilterKeys: [['Resource', '_type', '_class', '_key']],
      targetEntity: {
        _class: TargetEntities.CVE._class,
        _type: TargetEntities.CVE._type,
        _key: `cve_${findingEntity._key}`,
        Resource: TargetEntities.CVE.resourceName,
        displayName: findingEntity.displayName,
      },
      skipTargetCreation: true,
    },
  });
}

export function createMachineFindingsRelationship(
  machine: Entity,
  finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IDENTIFIED,
    from: machine,
    to: finding,
  });
}
