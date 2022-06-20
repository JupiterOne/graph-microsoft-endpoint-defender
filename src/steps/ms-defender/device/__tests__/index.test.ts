import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchMachines, buildMachineManagesDevicesRelationships } from '..';
import { entities } from '../../constants';
import { IntegrationConfig } from '../../../../../src/config';
import {
  Recording,
  setupProjectRecording,
} from '../../../../../test/recording';

const config: IntegrationConfig = {
  clientId: 'a8626c1e-191d-4e8f-9cbc-a4a6e85104ac',
  clientSecret: 'L3X8Q~BO57QkoAsXMSkevrmVR2qiNh.qKEuzucAt',
  tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
  isDefenderApi: false,
};

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});

describe('fetchMachines', () => {
  it('Should create an account entity correctly when the machine has the correct permissions', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetchMachines',
    });

    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchMachines(context);

    const machineEntities = context.jobState.collectedEntities;

    expect(machineEntities.length).toBe(0);
    expect(machineEntities).toMatchGraphObjectSchema({
      _class: entities.MACHINE._class,
    });
    expect(machineEntities).toMatchSnapshot('machineEntitiesSuccessful');
  });
});

describe('machineManagesDevicesRelationships', () => {
  it('Should create an machine entity correctly when  machine manages devices relationships has the correct permissions', async () => {
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await buildMachineManagesDevicesRelationships(context);

    const machineDeviceEntities = context.jobState.collectedEntities;

    expect(machineDeviceEntities.length).toBe(0);
    expect(machineDeviceEntities).toMatchGraphObjectSchema({
      _class: entities.MACHINE._class,
    });
    expect(machineDeviceEntities).toMatchSnapshot(
      'machineDeviceEntitiesSuccessful',
    );
  });
});
