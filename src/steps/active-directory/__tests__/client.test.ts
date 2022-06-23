import { integrationConfig } from '../../../../test/config';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { Machine, UserLogon, Finding } from '../../../types';
import { DefenderClient } from '../../ms-defender/clients/defenderClient';

import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../../config';
const logger: any = createMockIntegrationLogger();

const DEFAULT_CLIENT_ID = 'dummy-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy--client-secret';
const DEFAULT_TENANT = 'd68d7cbe-a848-4b5a-98d6-d7b3d6f3dfc0';

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

  test('inaccessible', () => {
    const client = new DefenderClient(logger, invalidMachineConfig);
    expect(client.iterateMachines(e)).rejects.toThrow(
      'Provider API failed at https://api.securitycenter.microsoft.com/api/machines: -1 AuthenticationError',
    );
  });

  test('insufficient permissions', () => {
    const client = new DefenderClient(logger, invalidMachineConfig);
    expect(client.iterateMachines(e)).rejects.toThrow(
      'Provider API failed at https://api.securitycenter.microsoft.com/api/machines: -1 AuthenticationError',
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

  test('multiple selected properties', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateUsers_multiple_properties',
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

  test('multiple selected properties', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateFindings_multiple_properties',
    });

    const resources: Finding[] = [];
    await client.iterateFindings(
      {
        machineId: '660688d26b586b005a90cc148bfb78ed8e55b32b',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBe(0);
  });
});
function e(e: any): Promise<void> {
  throw new Error('Function not implemented.');
}
