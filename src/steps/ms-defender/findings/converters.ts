import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  createMappedRelationship,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Finding } from '../../../types';
import { Entities, MappedRelationships } from '../../../constants';

export function createFindingKey(id: string): string {
  return `${Entities.FINDING._type}:${id}`;
}

const SEVERITY_TO_NUMERIC_SEVERITY_MAP = new Map<string, number>([
  ['low', 2],
  ['medium', 5],
  ['high', 7],
  ['critical', 10],
]);

export function getNumericSeverityFromIssueSeverity(
  issueSeverity: string,
): number {
  const numericSeverity = SEVERITY_TO_NUMERIC_SEVERITY_MAP.get(
    issueSeverity.toLowerCase(),
  );
  return numericSeverity === undefined ? 0 : numericSeverity;
}

export function createFindingEntity(data: Finding): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        id: data.id,
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,
        _key: createFindingKey(data.id),
        name: data.name,
        displayName: data.name,
        description: data.description,
        severity: data.severity,
        score: data.cvssV3,
        publishedOn: parseTimePropertyValue(data.publishedOn),
        updatedOn: parseTimePropertyValue(data.updatedOn),
        category: '',
        open: data.exposedMachines > 0,
        references: data.exploitUris,
        exposedMachines: data.exposedMachines,
        blocking: false,
        production: false,
        public: data.publicExploit,
        numericSeverity: getNumericSeverityFromIssueSeverity(data.severity),
      },
    },
  });
}

export function createFindingCveRelationship(
  findingEntity: Entity,
  cve: Finding,
): Relationship {
  const cveIdDisplay = cve.id.toUpperCase();

  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.FINDING_IS_CVE._type,
    _mapping: {
      sourceEntityKey: findingEntity._key,
      relationshipDirection: MappedRelationships.FINDING_IS_CVE.direction,
      targetFilterKeys: [['_type', '_key']],
      skipTargetCreation: false,
      targetEntity: {
        _type: 'cve',
        _key: cve.id.toLowerCase(),
        id: cve.id,
        score: cve.cvssV3,
        name: cveIdDisplay,
        displayName: cveIdDisplay,
        references: [`https://nvd.nist.gov/vuln/detail/${cve.id}`],
        webLink: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
      },
    },
  });
}

export function createMachineFindingRelationship({
  machineEntity,
  vulnerabilityEntity: findingEntity,
}: {
  machineEntity: Entity;
  vulnerabilityEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IDENTIFIED,
    from: machineEntity,
    to: findingEntity,
  });
}
