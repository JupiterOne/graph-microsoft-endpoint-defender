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
};

describe('createFindingEntity', () => {
  test('properties transferred', () => {
    expect(createFindingEntity(findingMock)).toBeTruthy();
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
