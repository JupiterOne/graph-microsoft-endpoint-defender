import {
  createFindingEntity,
  createFindingsCveRelationship,
  createMachineFindingsRelationship,
} from '../converters';
import { Entity } from '@jupiterone/integration-sdk-core';
import { Finding } from '../../../../types';
const machine: Entity = {
  _class: 'Machine',
  _key: 'microsoft_defender_machine_id',
  _type: 'microsoft_defender_machine',
  displayName: 'name',
};

const finding: Entity = {
  _class: 'Finding',
  _key: 'microsoft_defender_finding_id',
  _type: 'microsoft_defender_finding',
  displayName: 'name',
};

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
  _class: 'Finding',
  _key: 'microsoft_defender_finding_id',
  _type: 'microsoft_defender_finding',
};

const machineMock = {
  _class: ['HostAgent'],
  _type: 'microsoft_defender_machine',
  _key: 'f8c2d6c26063babf52bc76979ef22f423387f3b2',
  id: 'f8c2d6c26063babf52bc76979ef22f423387f3b2',
  agentVersion: '10.8040.19041.1682',
  defenderAvStatus: 'Unknown',
  riskScore: 'High',
  name: 'testmachine1',
  computerDnsName: 'testmachine1',
  displayName: 'testmachine1',
  function: ['endpoint-protection', 'vulnerability-detection'],
};

describe('createFindingEntity', () => {
  test('properties transferred', () => {
    expect(createFindingEntity(findingMock, machineMock)).toBeTruthy();
  });
});

describe('createFindingsCveRelationship', () => {
  test('properties transferred for users', () => {
    expect(createFindingsCveRelationship(machine)).toEqual({
      _class: 'IS',
      _key: 'microsoft_defender_machine_id|is|microsoft_defender_machine_id',
      _mapping: {
        relationshipDirection: 'FORWARD',
        skipTargetCreation: true,
        sourceEntityKey: 'microsoft_defender_machine_id',
        targetEntity: {
          _class: ['Vulnerability'],
          _key: 'microsoft_defender_machine_id',
          _type: 'cve',
          displayName: 'name',
        },
        targetFilterKeys: [['_type', '_key']],
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
