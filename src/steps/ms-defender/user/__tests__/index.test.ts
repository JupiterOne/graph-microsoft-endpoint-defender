import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { entities, fetchLogonUsers } from '..';
import { IntegrationConfig } from '../../../../../src/config';
import {
  Recording,
  setupProjectRecording,
} from '../../../../../test/recording';

const config: IntegrationConfig = {
  clientId: 'a8626c1e-191d-4e8f-9cbc-a4a6e85104ac',
  clientSecret: 'L3X8Q~BO57QkoAsXMSkevrmVR2qiNh.qKEuzucAt',
  tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
};

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});

describe('fetchLogonUsers', () => {
  it('Should create an User entity correctly when log on User has the correct permissions', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetchLogonUsers',
    });

    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchLogonUsers(context);
    const logOnUserEntities = context.jobState.collectedEntities;
    expect(logOnUserEntities.length).toBe(0);
    expect(logOnUserEntities).toMatchGraphObjectSchema({
      _class: entities.USER._class,
    });
    expect(logOnUserEntities).toMatchSnapshot('logOnUserEntitiesSuccessful');
  });
});
