import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<
  | 'FETCH_ACCOUNT'
  | 'FETCH_MACHINES'
  | 'FETCH_LOGON_USERS'
  | 'FETCH_USERS'
  | 'FETCH_FINDINGS'
  | 'FINDING_CVE_RELATIONSHIP'
  | 'FETCH_ENDPOINTS',
  { id: string; name: string }
> = {
  FETCH_ACCOUNT: { id: 'fetch-account', name: 'Fetch Account' },
  FETCH_MACHINES: { id: 'fetch-machines', name: 'Fetch Machines' },
  FETCH_LOGON_USERS: { id: 'fetch-logon-users', name: 'Fetch Logon Users' },
  FETCH_USERS: { id: 'fetch-users', name: 'Fetch Users' },
  FETCH_FINDINGS: {
    id: 'fetch-findings',
    name: 'Fetch Findings',
  },
  FINDING_CVE_RELATIONSHIP: {
    id: 'build-finding-cve-relationship',
    name: 'Build Finding and CVE Relationship',
  },
  FETCH_ENDPOINTS: {
    id: 'fetch-endpoints',
    name: 'Fetch Endpoints',
  },
};

export const Entities: Record<
  'ACCOUNT' | 'MACHINE' | 'LOGON_USER' | 'USER' | 'FINDING' | 'ENDPOINT',
  StepEntityMetadata
> = {
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
  LOGON_USER: {
    resourceName: 'Logon User',
    _type: 'microsoft_defender_logon_user',
    _class: ['User'],
  },
  USER: {
    resourceName: 'User',
    _type: 'microsoft_defender_user',
    _class: ['User'],
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'microsoft_defender_finding',
    _class: ['Finding'],
  },
  ENDPOINT: {
    resourceName: 'Device/Machine/Host',
    _type: 'user_endpoint',
    _class: ['Device'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_MACHINE'
  | 'ACCOUNT_HAS_USER'
  | 'MACHINE_HAS_LOGON_USER'
  | 'MACHINE_IDENTIFIED_FINDING'
  | 'MACHINE_MANAGES_ENDPOINT',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_MACHINE: {
    _type: 'microsoft_defender_account_has_machine',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.MACHINE._type,
  },
  ACCOUNT_HAS_USER: {
    _type: 'microsoft_defender_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  MACHINE_HAS_LOGON_USER: {
    _type: 'microsoft_defender_machine_has_logon_user',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.LOGON_USER._type,
  },
  MACHINE_IDENTIFIED_FINDING: {
    _type: 'microsoft_defender_machine_identified_finding',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
  MACHINE_MANAGES_ENDPOINT: {
    _type: 'microsoft_defender_machine_manages_user_endpoint',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.ENDPOINT._type,
  },
};

export const MappedRelationships: Record<
  'FINDING_IS_CVE',
  StepMappedRelationshipMetadata
> = {
  FINDING_IS_CVE: {
    _type: 'microsoft_defender_finding_is_cve',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: 'cve',
    direction: RelationshipDirection.FORWARD,
  },
};

export const ACCOUNT_ENTITY_KEY = 'entity:account';
