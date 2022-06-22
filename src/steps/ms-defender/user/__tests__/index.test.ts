import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { entities, fetchLogonUsers } from '..';
import { IntegrationConfig } from '../../../../../src/config';
import {
  Recording,
  setupProjectRecording,
} from '../../../../../test/recording';

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
