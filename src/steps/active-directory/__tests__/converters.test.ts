import { Machine, Finding } from '../../../types';
import {
  createAccountEntityWithOrganization,
  createAccountEntity,
  createMachineEntity,
  createMachinesDeviceRelationship,
  generateUserKey,
  createFindingEntity,
  createMachineUserRelationship,
  createAccountMachineRelationship,
  createFindingsCveRelationship,
  createMachineFindingsRelationship,
} from '../converters';
import { Organization, User } from '@microsoft/microsoft-graph-types';
import { Entity, IntegrationInstance } from '@jupiterone/integration-sdk-core';
import { integrationConfig } from '../../../../test/config';
const exampleOrganization: Organization = {};
const instance: IntegrationInstance = {
  id: '',
  accountId: '',
  name: '',
  integrationDefinitionId: '',
  config: integrationConfig,
};
const exampleAccountEntity: Entity = {
  _class: 'Account',
  _key: 'microsoft_defender_account_id',
  _type: 'microsoft_defender_account',
  displayName: 'name',
};
describe('createAccountEntityWithOrganization', () => {
  test('properties transferred', () => {
    const exampleIntuneConfig = {
      mobileDeviceManagementAuthority: 'mobileDeviceManagementAuthority',
      subscriptionState: 'subscriptionState',
      intuneAccountID: 'intuneAccountID',
    };
    const accountEntity = createAccountEntityWithOrganization(
      instance,
      exampleOrganization,
      exampleIntuneConfig,
    );
    expect(accountEntity).toMatchSnapshot(
      'createAccountEntityWithOrganization',
    );
  });
});

describe('createAccountEntity', () => {
  test('properties transferred', () => {
    expect(createAccountEntity(instance)).toEqual({
      _class: ['Account'],
      _key: 'microsoft_defender_account-',
      _type: 'microsoft_defender_account',
      createdOn: undefined,
      displayName: '',
      name: '',
      _rawData: [],
    });
  });
});

describe('createMachineEntity', () => {
  test('properties transferred', () => {
    const VmMetadata = {
      vmId: 'string',
      cloudProvider: 'string',
      resourceId: 'string',
      subscriptionId: 'string',
    };
    const rawData: Machine = {
      id: 'string',
      computerDnsName: 'string',
      firstSeen: 'string',
      lastSeen: 'string',
      classification: 'string',
      onboardingStatus: 'string',
      healthStatus: 'string',
      deviceValue: 'string',
      agentVersion: 'string',
      defenderAvStatus: 'string',
      riskScore: 'string',
      osPlatform: 'string',
      osVersion: 'any',
      osProcessor: 'string',
      version: 'string',
      lastIpAddress: 'string',
      lastExternalIpAddress: 'string',
      osBuild: 1234,
      rbacGroupId: 456,
      rbacGroupName: 'string',
      exposureLevel: 'string',
      isAadJoined: true,
      aadDeviceId: 'any',
      machineTags: [],
      osArchitecture: 'string',
      managedBy: 'string',
      managedByStatus: 'string',
      ipAddresses: [],
      vmMetadata: VmMetadata,
    };
    expect(createMachineEntity(rawData)).toEqual({
      _class: ['HostAgent'],
      _key: 'string',
      _rawData: [],
      _type: 'microsoft_defender_machine',
      agentVersion: 'string',
      computerDnsName: 'string',
      createdOn: undefined,
      defenderAvStatus: 'string',
      displayName: 'string',
      function: ['endpoint-protection', 'vulnerability-detection'],
      id: 'string',
      name: 'string',
      riskScore: 'string',
    });
  });
});

describe('createMachinesDeviceRelationship', () => {
  test('properties transferred', () => {
    expect(createMachinesDeviceRelationship(exampleAccountEntity)).toEqual({
      _class: 'MANAGES',
      _key: 'microsoft_defender_account_id|manages|FORWARD:_type=user_endPoint:_class=Device,Host:hostname=undefined',
      _mapping: {
        relationshipDirection: 'FORWARD',
        skipTargetCreation: true,
        sourceEntityKey: 'microsoft_defender_account_id',
        targetEntity: {
          _class: ['Device', 'Host'],
          _type: 'user_endPoint',
          category: 'endpoint',
          displayName: undefined,
          fqdn: undefined,
          hostname: undefined,
          id: undefined,
          name: 'name',
          osName: undefined,
          osVersion: undefined,
          platform: undefined,
        },
        targetFilterKeys: [['_type', '_class', 'hostname']],
      },
      _type: 'microsoft_defender_machine_manages_user_endPoint',
      displayName: 'MANAGES',
    });
  });
});
const userMock: User = {};
describe('generateUserKey', () => {
  test('properties transferred', () => {
    expect(generateUserKey(userMock)).toEqual(undefined);
  });
});
const findingMock: Finding = {
  id: '12345',
  name: 'abc',
  description: 'abc',
  severity: 'high',
  cvssV3: '123acdf',
  exposedMachines: 'none',
  publishedOn: '01/02/12',
  updatedOn: '02/05/22',
  publicExploit: true,
  exploitVerified: false,
  exploitInKit: false,
  exploitTypes: [],
  exploitUris: [],
};
describe('createFindingEntity', () => {
  test('properties transferred', () => {
    expect(createFindingEntity(findingMock)).toBeTruthy();
  });
});
const machine: Entity = {
  _class: 'Machine',
  _key: 'microsoft_defender_machine_id',
  _type: 'microsoft_defender_machine',
  displayName: 'name',
};
const user: Entity = {
  _class: 'User',
  _key: 'microsoft_defender_user_id',
  _type: 'microsoft_defender_user',
  displayName: 'name',
};

const finding: Entity = {
  _class: 'Finding',
  _key: 'microsoft_defender_finding_id',
  _type: 'microsoft_defender_finding',
  displayName: 'name',
};

const account: Entity = {
  _class: 'Account',
  _key: 'microsoft_defender_account_id',
  _type: 'microsoft_defender_account',
  displayName: 'name',
};

describe('createMachineUserRelationship', () => {
  test('properties transferred for users', () => {
    expect(createMachineUserRelationship(machine, user)).toEqual({
      _fromEntityKey: 'microsoft_defender_machine_id',
      _key: 'microsoft_defender_machine_id|has|microsoft_defender_user_id',
      _toEntityKey: 'microsoft_defender_user_id',
      _type: 'microsoft_defender_machine_has_user',
      displayName: 'HAS',
      _class: 'HAS',
    });
  });
});

describe('createAccountMachineRelationship', () => {
  test('properties transferred for users', () => {
    expect(createAccountMachineRelationship(machine, account)).toEqual({
      _fromEntityKey: 'microsoft_defender_machine_id',
      _key: 'microsoft_defender_machine_id|has|microsoft_defender_account_id',
      _toEntityKey: 'microsoft_defender_account_id',
      _type: 'microsoft_defender_machine_has_account',
      displayName: 'HAS',
      _class: 'HAS',
    });
  });
});

describe('createFindingsCveRelationship', () => {
  test('properties transferred for users', () => {
    expect(createFindingsCveRelationship(machine)).toEqual({
      _class: 'IS',
      _key: 'microsoft_defender_machine_id|is|cve_microsoft_defender_machine_id',
      _mapping: {
        relationshipDirection: 'FORWARD',
        skipTargetCreation: true,
        sourceEntityKey: 'microsoft_defender_machine_id',
        targetEntity: {
          Resource: 'CVE',
          _class: ['Vulnerability'],
          _key: 'cve_microsoft_defender_machine_id',
          _type: 'cve',
          displayName: 'name',
        },
        targetFilterKeys: [['Resource', '_type', '_class', '_key']],
      },
      _type: 'microsoft_defender_vulnerability_is_cve',
      displayName: 'IS',
    });
  });
});

describe('createMachineFindingsRelationship', () => {
  test('properties transferred for users', () => {
    expect(createMachineFindingsRelationship(machine, finding)).toEqual({
      _key: 'microsoft_defender_machine_id|identified|microsoft_defender_finding_id',
      _type: 'microsoft_defender_machine_identified_finding',
      displayName: 'IDENTIFIED',
      _class: 'IDENTIFIED',
      _fromEntityKey: 'microsoft_defender_machine_id',
      _toEntityKey: 'microsoft_defender_finding_id',
    });
  });
});
