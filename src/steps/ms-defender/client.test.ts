import {
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import { Vulnerability, Machine, UserLogon } from '../../types';
import { DefenderClient } from './client';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('iterateMachines', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterateMachines',
  });

  const client = new DefenderClient(
    createMockIntegrationLogger(),
    integrationConfig,
  );

  const machines: Machine[] = [];
  await client.iterateMachines((machine) => {
    machines.push(machine);
  });

  expect(machines.length).toBeGreaterThan(0);
  expect(machines).toMatchSnapshot();
});

test.skip('iterateLogonUsers', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterateLogonUsers',
  });

  const client = new DefenderClient(
    createMockIntegrationLogger(),
    integrationConfig,
  );

  const machines: Machine[] = [];
  await client.iterateMachines((machine) => {
    machines.push(machine);
  });

  const logonUsers: UserLogon[] = [];
  for (const { id: machineId } of machines) {
    await client.iterateLogonUsers({ machineId }, (logonUser) => {
      logonUsers.push(logonUser);
    });
  }

  expect(logonUsers.length).toBeGreaterThan(0);
  expect(logonUsers).toMatchSnapshot();
});

test('iterateVulnerabilities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterateVulnerabilities',
  });

  const client = new DefenderClient(
    createMockIntegrationLogger(),
    integrationConfig,
  );

  const machines: Machine[] = [];
  await client.iterateMachines((machine) => {
    machines.push(machine);
  });

  const vulnerabilities: Vulnerability[] = [];
  for (const { id: machineId } of machines) {
    await client.iterateVulnerabilities({ machineId }, (vulnerability) => {
      vulnerabilities.push(vulnerability);
    });
  }

  expect(vulnerabilities.length).toBeGreaterThan(0);
  expect(vulnerabilities).toMatchSnapshot();
});

test('iterateMachinesPagination', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterateMachines_pagination',
  });

  const client = new DefenderClient(
    createMockIntegrationLogger(),
    integrationConfig,
  );
  let spy = jest.spyOn(client as any, 'callApiWithRetry');
  const machines: Machine[] = [];
  await client.iterateMachines((machine) => {
    machines.push(machine);
  }, 1);

  expect(machines.length).toBeGreaterThan(0);
  expect(machines).toMatchSnapshot();
  expect(spy.mock.calls).toHaveLength(machines.length + 1);
}, 500_000);
