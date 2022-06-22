import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { entities, fetchLogonUsers } from '..';
import { IntegrationConfig } from '../../../../../src/config';
import {
  Recording,
  setupProjectRecording,
} from '../../../../../test/recording';
import { UserLogon } from '../../../../types';
import { DefenderClient } from '../../../ms-defender/clients/defenderClient';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
const DEFAULT_CLIENT_ID = 'dummy-acme-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';
const DEFAULT_TENANT = 'dummy-tenant';

const config: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
  tenant: process.env.TENANT || DEFAULT_TENANT,
};

const logger: any = createMockIntegrationLogger();
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
    const client = new DefenderClient(logger, config);
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchLogonUsers(context);
    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: 'e76b865d4bc0c2622547459464020e9e24f51f75',
      },
      (e) => {
        resources.push(e);
      },
    );
    const logOnUserEntities = context.jobState.collectedEntities;
    expect(resources.length).toBe(1);
    expect(logOnUserEntities.length).toBe(0);
    expect(logOnUserEntities).toMatchGraphObjectSchema({
      _class: entities.USER._class,
    });
    expect(resources).toMatchSnapshot(resources);
  });
});
