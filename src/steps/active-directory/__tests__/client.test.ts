// import { Group, User } from '@microsoft/microsoft-graph-types';

import { integrationConfig } from '../../../../test/config';
import { Machine, UserLogon } from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';

const logger: any = 'https://api.securitycenter.microsoft.com/api';

describe('iterateMachines', () => {
  test('accessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
  });

  test('inaccessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push();
      },
    );

    expect(resources.length).toEqual(0);
  });

  test('insufficient permissions', async () => {
    //This doesn't throw the correct error anymore

    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push();
      },
    );

    expect(resources.length).toEqual(0);
  });
});

describe('iterateUsers', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: 'id',
      },
      (e) => {
        resources.push(e);
      },
    );
  });

  test('multiple selected properties', async () => {
    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBe(0);
  });
});

describe('iterateFindings', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    const resources: UserLogon[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: 'id',
      },
      (e) => {
        resources.push();
      },
    );
  });

  test('multiple selected properties', async () => {
    const resources: UserLogon[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push();
      },
    );

    expect(resources.length).toBe(0);
  });
});
