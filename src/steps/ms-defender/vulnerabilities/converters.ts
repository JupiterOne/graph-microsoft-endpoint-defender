import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  createMappedRelationship,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Vulnerability } from '../../../types';
import { Entities, MappedRelationships } from '../../../constants';

export function createVulnerabilityKey(id: string): string {
  return `${Entities.VULNERABILITY._type}:${id}`;
}

export function createVulnerabilityEntity(data: Vulnerability): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        id: data.id,
        _type: Entities.VULNERABILITY._type,
        _class: Entities.VULNERABILITY._class,
        _key: createVulnerabilityKey(data.id),
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
        numericSeverity: data.cvssV3,
      },
    },
  });
}

export function createVulnerabilityCveRelationship(
  vulnerabilityEntity: Entity,
  cve: Vulnerability,
): Relationship {
  const cveIdDisplay = cve.id.toUpperCase();

  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.VULNERABILITY_IS_CVE._type,
    _mapping: {
      sourceEntityKey: vulnerabilityEntity._key,
      relationshipDirection: MappedRelationships.VULNERABILITY_IS_CVE.direction,
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

export function createMachineVulnerabilityRelationship({
  machineEntity,
  vulnerabilityEntity,
}: {
  machineEntity: Entity;
  vulnerabilityEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IDENTIFIED,
    from: machineEntity,
    to: vulnerabilityEntity,
  });
}
