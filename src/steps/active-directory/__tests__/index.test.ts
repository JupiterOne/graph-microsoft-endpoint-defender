import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import {
  entities,
  // TargetEntities,
  fetchAccount,
} from '..';
import { IntegrationConfig } from '../../../../src/config';
import { Recording } from '../../../../test/recording';

const config: IntegrationConfig = {
  clientId: 'a8626c1e-191d-4e8f-9cbc-a4a6e85104ac',
  clientSecret: 'L3X8Q~BO57QkoAsXMSkevrmVR2qiNh.qKEuzucAt',
  tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
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
