import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { Group, User } from '@microsoft/microsoft-graph-types';

import { integrationConfig } from '../../../../test/config';
import { DirectoryGraphClient } from '../clients/directoryClient';

const logger = createMockIntegrationLogger();

// let recording: Recording;

// afterEach(async () => {
//   if (recording) {
//     await recording.stop();
//   }
// });

describe('iterateMachines', () => {
  test('accessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Group[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        displayName: expect.any(String),
      });
    });
  });

  test('inaccessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);
    const infoSpy = jest.spyOn(logger, 'info');

    const resources: Group[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toEqual(0);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith(
      { resourceUrl: '/machines' },
      'Unauthorized',
    );
  });

  test('insufficient permissions', async () => {
    //This doesn't throw the correct error anymore

    const client = new DirectoryGraphClient(logger, integrationConfig);
    const infoSpy = jest.spyOn(logger, 'info');

    const resources: Group[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toEqual(0);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith(
      { resourceUrl: '/machines' },
      'Unauthorized',
    );
  });
});

describe('iterateUsers', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    const resources: User[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: 'id',
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        id: expect.any(String),
      });
    });

    const resource = resources[0];
    expect(resource.displayName).toBeUndefined();
  });

  test('multiple selected properties', async () => {
    const resources: User[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        id: expect.any(String),
        displayName: expect.any(String),
      });
    });
  });
});

describe('iterateFindings', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    const resources: User[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: 'id',
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        id: expect.any(String),
      });
    });

    const resource = resources[0];
    expect(resource.displayName).toBeUndefined();
  });

  test('multiple selected properties', async () => {
    const resources: User[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        id: expect.any(String),
        displayName: expect.any(String),
      });
    });
  });
});
