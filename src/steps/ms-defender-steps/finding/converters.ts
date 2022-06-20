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

export function createFindingEntity(defenderFinding: Finding): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        id: defenderFinding.id,
        _type: entities.FINDING._type,
        _class: entities.FINDING._class,
        _key: defenderFinding.id + '_' + Math.random() * 1000000,
        name: defenderFinding.name,
        displayName: defenderFinding.name,
        description: defenderFinding.description,
        severity: defenderFinding.severity,
        score: defenderFinding.cvssV3,
        numericSeverity: 0,
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
