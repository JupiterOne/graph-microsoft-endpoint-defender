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
      computerDnsName: 'Machine List',
      firstSeen: '8/5/2018',
      lastSeen: '22/01/2022',
      classification: 'none',
      onboardingStatus: 'done',
      healthStatus: 'High',
      deviceValue: '40',
      agentVersion: 'defender version',
      defenderAvStatus: 'valid',
      riskScore: 'none',
      osPlatform: 'windows,linus',
      osVersion: '10',
      osProcessor: 'windows',
      version: '32',
      lastIpAddress: '1.0.10.22',
      lastExternalIpAddress: '10.0.10.5',
      osBuild: 1234,
      rbacGroupId: 456,
      rbacGroupName: 'none',
      exposureLevel: 'high',
      isAadJoined: true,
      aadDeviceId: '10547',
      machineTags: [],
      osArchitecture: 'none',
      managedBy: 'ms defender',
      managedByStatus: 'done',
      ipAddresses: [],
      vmMetadata: VmMetadata,
    };
    expect(createMachineEntity(rawData)).toEqual({
      _class: ['HostAgent'],
      _key: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
      _rawData: [
        {
          name: 'default',
          rawData: {
            aadDeviceId: '10547',
            agentVersion: 'defender version',
            classification: 'none',
            computerDnsName: 'Machine List',
            defenderAvStatus: 'valid',
            deviceValue: '40',
            exposureLevel: 'high',
            firstSeen: '8/5/2018',
            healthStatus: 'High',
            id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
            ipAddresses: [],
            isAadJoined: true,
            lastExternalIpAddress: '10.0.10.5',
            lastIpAddress: '1.0.10.22',
            lastSeen: '22/01/2022',
            machineTags: [],
            managedBy: 'ms defender',
            managedByStatus: 'done',
            onboardingStatus: 'done',
            osArchitecture: 'none',
            osBuild: 1234,
            osPlatform: 'windows,linus',
            osProcessor: 'windows',
            osVersion: '10',
            rbacGroupId: 456,
            rbacGroupName: 'none',
            riskScore: 'none',
            version: '32',
            vmMetadata: {
              cloudProvider: 'string',
              resourceId: 'string',
              subscriptionId: 'string',
              vmId: 'string',
            },
          },
        },
      ],
      _type: 'microsoft_defender_machine',
      agentVersion: 'defender version',
      classification: 'none',
      computerDnsName: 'Machine List',
      createdOn: undefined,
      defenderAvStatus: 'valid',
      displayName: 'Machine List',
      function: ['endpoint-protection', 'vulnerability-detection'],
      id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
      name: 'Machine List',
      riskScore: 'none',
    });
  });
});

describe('createMachinesDeviceRelationship', () => {
  test('properties transferred', () => {
    expect(createMachinesDeviceRelationship(exampleAccountEntity)).toEqual({
      _class: 'MANAGES',
      _key: 'microsoft_defender_account_id|manages|FORWARD:_type=user_endpoint:_class=Device,Host:hostname=undefined',
      _mapping: {
        relationshipDirection: 'FORWARD',
        skipTargetCreation: true,
        sourceEntityKey: 'microsoft_defender_account_id',
        targetEntity: {
          _class: ['Device', 'Host'],
          _type: 'user_endpoint',
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
      _type: 'microsoft_defender_machine_manages_user_endpoint',
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
