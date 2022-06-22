import { integrationConfig } from '../../../../test/config';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { Machine, UserLogon, Finding } from '../../../types';
import { DefenderClient } from '../../ms-defender/clients/defenderClient';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
const logger: any = createMockIntegrationLogger();

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
    const client = new DefenderClient(logger, integrationConfig);

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
    const client = new DefenderClient(logger, integrationConfig);

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
        resources.push();
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
        resources.push();
      },
    );

    expect(resources.length).toBe(0);
  });
});
