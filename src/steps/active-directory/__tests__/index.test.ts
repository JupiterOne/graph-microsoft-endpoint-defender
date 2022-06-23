import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import {
  entities,
  // TargetEntities,
  fetchAccount,
} from '..';
import { IntegrationConfig } from '../../../../src/config';
import { Recording } from '../../../../test/recording';

const DEFAULT_CLIENT_ID = 'dummy-acme-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';
const DEFAULT_TENANT = 'dummy-tenant';

const config: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
  tenant: process.env.TENANT || DEFAULT_TENANT,
};

const insufficientPermissionsDirectoryConfig: IntegrationConfig = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
};
// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});

describe('fetchAccount', () => {
  it('Should create an account entity correctly when the account has the correct permissions', async () => {
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchAccount(context);

    const accountEntities = context.jobState.collectedEntities;

    expect(accountEntities.length).toBe(1);
    expect(accountEntities).toMatchGraphObjectSchema({
      _class: entities.ACCOUNT._class,
    });
    expect(accountEntities).toMatchSnapshot('accountEntitiesSuccessful');
  });

  it('Should error when there are errors attempting to get organization data', () => {
    const context = createMockStepExecutionContext({
      instanceConfig: insufficientPermissionsDirectoryConfig,
    });
    expect(fetchAccount(context)).rejects;
  });
});
