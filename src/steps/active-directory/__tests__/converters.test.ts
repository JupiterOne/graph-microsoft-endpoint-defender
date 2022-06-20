import {
  createAccountEntityWithOrganization,
  createAccountEntity,
  createAccountMachineRelationship,
} from '../converters';
import { Organization } from '@microsoft/microsoft-graph-types';
import { Entity, IntegrationInstance } from '@jupiterone/integration-sdk-core';
import { integrationConfig } from '../../../../test/config';
const exampleOrganization: Organization = {};
const instance: IntegrationInstance = {
  id: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
  accountId: '',
  name: 'DefenderAccount',
  integrationDefinitionId: '',
  config: integrationConfig,
};
describe('createAccountEntityWithOrganization', () => {
  test('properties transferred', () => {
    const accountEntity = createAccountEntityWithOrganization(
      instance,
      exampleOrganization,
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
      _key: 'microsoft_defender_account-5a721b05-53ed-4ed9-be02-aed28f11edbd',
      _type: 'microsoft_defender_account',
      createdOn: undefined,
      displayName: 'DefenderAccount',
      name: 'DefenderAccount',
      _rawData: [],
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
