import { RelationshipClass } from '@jupiterone/integration-sdk-core';

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
};

export const relationships = {
  ACCOUNT_HAS_MACHINE: {
    _type: 'microsoft_defender_account_has_machine',
    sourceType: entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: entities.MACHINE._type,
  },
};

export const DATA_ACCOUNT_ENTITY = entities.ACCOUNT._type;
