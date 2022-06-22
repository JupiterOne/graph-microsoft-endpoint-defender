import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchMachines, buildMachineManagesDevicesRelationships } from '..';
import { entities } from '../../constants';
import { IntegrationConfig } from '../../../../../src/config';
import { Machine } from '../../../../types';
import { DefenderClient } from '../../../ms-defender/clients/defenderClient';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { Recording } from '../../../../../test/recording';
const DEFAULT_CLIENT_ID = 'dummy-acme-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';
const DEFAULT_TENANT = 'dummy-tenant';

const config: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
  tenant: process.env.TENANT || DEFAULT_TENANT,
};

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});
const context = createMockStepExecutionContext({ instanceConfig: config });
const logger: any = createMockIntegrationLogger();
describe('fetchMachines', () => {
  it('Should create an account entity correctly when the machine has the correct permissions', async () => {
    // recording = setupProjectRecording({
    //   directory: __dirname,
    //   name: 'fetchMachines',
    // });

    await fetchMachines(context);

    const machineEntities = context.jobState.collectedEntities;
    const client = new DefenderClient(logger, config);

    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
    expect(machineEntities.length).toBe(0);
    expect(machineEntities).toMatchGraphObjectSchema({
      _class: entities.MACHINE._class,
    });
    expect(resources).toMatchSnapshot(resources);
  });
});

describe('machineManagesDevicesRelationships', () => {
  it('Should create an machine entity correctly when  machine manages devices relationships has the correct permissions', async () => {
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await buildMachineManagesDevicesRelationships(context);
    const client = new DefenderClient(logger, config);
    const machineDeviceEntities = context.jobState.collectedEntities;
    const resources: Machine[] = [];

    await client.iterateMachines((e) => {
      resources.push(e);
    });
    expect(machineDeviceEntities.length).toBe(0);
    expect(machineDeviceEntities).toMatchGraphObjectSchema({
      _class: entities.MACHINE._class,
    });
    expect(resources).toMatchSnapshot(resources);
  });
});
