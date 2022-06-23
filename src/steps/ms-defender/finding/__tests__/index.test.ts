import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import {
  entities,
  TargetEntities,
  fetchFindings,
  buildFindingIsCveRelationships,
} from '..';
import { IntegrationConfig } from '../../../../../src/config';
import {
  Recording,
  setupProjectRecording,
} from '../../../../../test/recording';
import { Finding } from '../../../../types';
import { DefenderClient } from '../../../ms-defender/clients/defenderClient';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';

const DEFAULT_CLIENT_ID = 'dummy-acme-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';
const DEFAULT_TENANT = 'dummy-tenant';

const config: IntegrationConfig = {
  clientId: 'a8626c1e-191d-4e8f-9cbc-a4a6e85104ac',
  clientSecret: 'L3X8Q~BO57QkoAsXMSkevrmVR2qiNh.qKEuzucAt',
  tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
};

const logger: any = createMockIntegrationLogger();

// See test/README.md for details
// let recording: Recording;
// afterEach(async () => {
//   recording ? await recording.stop() : null;
// });

describe('fetchFindings', () => {
  it('Should create a Vulnerability finding entity correctly when user has the correct permissions', async () => {
    // recording = setupProjectRecording({
    //   directory: __dirname,
    //   name: 'fetchFindings',
    // });

    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchFindings(context);
    const client = new DefenderClient(logger, config);
    const vulnerabilityFindingEntities = context.jobState.collectedEntities;
    const resources: Finding[] = [];
    await client.iterateFindings(
      {
        machineId: 'ef9f015a-f7af-4764-aed1-88b91718eda6',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );
    expect(resources.length).toBe(0);
    expect(vulnerabilityFindingEntities.length).toBe(0);
    expect(vulnerabilityFindingEntities).toMatchGraphObjectSchema({
      _class: entities.FINDING._class,
    });
    expect(resources).toMatchSnapshot(resources);
  });
});

describe('CveRelationshipsFindings', () => {
  it('Should create a Vulnerability finding entity correctly when there is a CVE relationship', async () => {
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await buildFindingIsCveRelationships(context);

    const cveFindingEntities = context.jobState.collectedEntities;

    expect(cveFindingEntities.length).toBe(0);
    expect(cveFindingEntities).toMatchGraphObjectSchema({
      _class: TargetEntities.CVE._class,
    });
    expect(cveFindingEntities).toMatchSnapshot('cveFindingEntitiesSuccessful');
  });
});
