import { generateUserKey, createMachineUserRelationship } from '../converters';
import { Entity } from '@jupiterone/integration-sdk-core';
import { User } from '@microsoft/microsoft-graph-types';

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

const userMock: User = {};
describe('generateUserKey', () => {
  test('properties transferred', () => {
    expect(generateUserKey(userMock)).toEqual(undefined);
  });
});

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
