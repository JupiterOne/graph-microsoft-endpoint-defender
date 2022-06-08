import {
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

export const steps: Record<string, string> = {
  FETCH_ACCOUNT: 'Fetch account',
  FETCH_MACHINE: 'Fetch machine',
  MACHINE_DEVICE_RELATIONSHIP: 'Map machine to device',
  FETCH_USERS: 'Fetch users',
  FETCH_FINDINGS: 'Fetch findings',
  FINDING_VULNERABILITY_RELATIONSHIP: 'Map finding to vulnerability',
};

export const entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'microsoft_defender_account',
    _class: ['Account'],
  },
  MACHINE: {
    resourceName: 'Machine',
    _type: 'microsoft_defender_machine',
    _class: ['HostAgent'],
  },

  USER: {
    resourceName: 'User',
    _type: 'microsoft_defender_logon_user',
    _class: ['User'],
  },
  FINDING: {
    resourceName: 'Vulnerability',
    _type: 'microsoft_defender_vulnerability',
    _class: ['Finding'],
  },
};

export const TargetEntities = {
  CVE: {
    resourceName: 'CVE',
    _type: 'cve',
    _class: ['Vulnerability'],
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'user_endPoint',
    _class: ['Device/Host'],
  },
};

export const relationships = {
  ACCOUNT_HAS_MACHINE: {
    _type: 'microsoft_defender_account_has_machine',
    sourceType: entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: entities.MACHINE._type,
  },
  MACHINE_HAS_USER: {
    _type: 'microsoft_defender_machine_has_logon_user',
    sourceType: entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: entities.USER._type,
  },
  MACHINE_IDENTIFIED_FINDING: {
    _type: 'microsoft_defender_machine_identified_vulnerability',
    sourceType: entities.MACHINE._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: entities.FINDING._type,
  },
};

export const MappedRelationships = {
  FINDING_IS_CVE_VULNERABILITY: {
    _type: 'microsoft_defender_vulnerability_is_cve',
    sourceType: entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: TargetEntities.CVE._type,
    direction: RelationshipDirection.FORWARD,
  },
  MACHINE_MANAGES_DEVICE: {
    _type: 'microsoft_defender_machine_manages_user_endPoint',
    sourceType: entities.MACHINE._type,
    _class: RelationshipClass.MANAGES,
    targetType: TargetEntities.DEVICE._type,
    direction: RelationshipDirection.FORWARD,
  },
};

export const DATA_ACCOUNT_ENTITY = entities.ACCOUNT._type;
export const DATA_MACHINE_ENTITY = entities.MACHINE._type;
export const DATA_FINDING_ENTITY = entities.FINDING._type;
