import {
  createMachineEntity,
  createMachinesDeviceRelationship,
  createAccountMachineRelationship,
} from '../converters';
import { Entity } from '@jupiterone/integration-sdk-core';
import { Machine } from '../../../../types';
const exampleAccountEntity: Entity = {
  _class: 'Account',
  _key: 'microsoft_defender_account_id',
  _type: 'microsoft_defender_account',
  displayName: 'name',
  id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
};

describe('createMachineEntity', () => {
  test('properties transferred', () => {
    const VmMetadata = {
      vmId: 'string',
      cloudProvider: 'string',
      resourceId: 'string',
      subscriptionId: 'string',
    };
    const rawData: Machine = {
      id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
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
      _key: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
      _rawData: [],
      _type: 'microsoft_defender_machine',
      agentVersion: 'string',
      computerDnsName: 'string',
      createdOn: undefined,
      defenderAvStatus: 'string',
      displayName: 'string',
      function: ['endpoint-protection', 'vulnerability-detection'],
      id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
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
          id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
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

const machine: Entity = {
  _class: 'Machine',
  _key: 'microsoft_defender_machine_id',
  _type: 'microsoft_defender_machine',
  displayName: 'name',
};

const account: Entity = {
  _class: 'Account',
  _key: 'microsoft_defender_account_id',
  _type: 'microsoft_defender_account',
  displayName: 'name',
};

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
