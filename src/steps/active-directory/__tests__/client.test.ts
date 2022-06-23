import { integrationConfig } from '../../../../test/config';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { Machine, UserLogon, Finding } from '../../../types';
import { DefenderClient } from '../../ms-defender/clients/defenderClient';

import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../../config';
// import { IntegrationConfig } from '../../../config';
const logger: any = createMockIntegrationLogger();

const DEFAULT_CLIENT_ID = '4195c8d3-7f61-4120-b930-e98f66ed1fa7';
const DEFAULT_CLIENT_SECRET = 'InS8Q~xhr5ZXXalbVS3M.qz2X.6gynhah6WdkaJ~'; // Dummy key to fail the API call
const DEFAULT_TENANT = '9c48d2a3-ec56-411a-96b4-af7c7b445514';

const invalidMachineConfig: IntegrationConfig = {
  clientId: DEFAULT_CLIENT_ID,
  clientSecret: DEFAULT_CLIENT_SECRET,
  tenant: DEFAULT_TENANT,
};
// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});

describe('iterateMachines', () => {
  test('accessible', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateMachines',
    });

    const client = new DefenderClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
  });

  test('inaccessible', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateMachinesInaccessible',
      options: { recordFailedRequests: true },
    });

    const client = new DefenderClient(logger, invalidMachineConfig);
    const infoSpy = jest.spyOn(logger, 'info');

    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toEqual(0);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith(
      { resourceUrl: 'https://api.securitycenter.microsoft.com/api/machines' },
      'Unauthorized',
    );
  });

  test('insufficient permissions', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateMachinesInsufficientPermissions',
      options: { recordFailedRequests: true },
    });

    const client = new DefenderClient(logger, invalidMachineConfig);
    const infoSpy = jest.spyOn(logger, 'info');
    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });
    expect(resources.length).toEqual(0);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith(
      { resourceUrl: 'https://api.securitycenter.microsoft.com/api/machines' },
      'Unauthorized',
    );
  });
});

describe('iterateUsers', () => {
  let client: DefenderClient;

  beforeEach(() => {
    client = new DefenderClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateUsers_single_properties',
    });

    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: 'e76b865d4bc0c2622547459464020e9e24f51f75',
      },
      (e) => {
        resources.push(e);
      },
    );
    expect(resources.length).toBe(1);
  });
});

describe('iterateFindings', () => {
  let client: DefenderClient;

  beforeEach(() => {
    client = new DefenderClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateFindings_single_properties',
    });

    const resources: Finding[] = [];
    await client.iterateFindings(
      {
        machineId: 'e76b865d4bc0c2622547459464020e9e24f51f75',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );
    expect(resources.length).toBe(0);
  });
});
