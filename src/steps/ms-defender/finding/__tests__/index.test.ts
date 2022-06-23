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

describe('fetchFindings', () => {
  it('Should create a Vulnerability finding entity correctly when user has the correct permissions', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetchFindings',
    });

    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchFindings(context);
    const client = new DefenderClient(logger, config);
    const vulnerabilityFindingEntities = context.jobState.collectedEntities;
    const resources: Finding[] = [];
    await client.iterateFindings(
      {
        machineId: '0c4ccbde5e82eded51a533de002894276ce0617d',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );
    expect(resources.length).toBeGreaterThan(0);
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
    const client = new DefenderClient(logger, config);
    const resources: Finding[] = [];
    await client.iterateFindings(
      {
        machineId: '0c4ccbde5e82eded51a533de002894276ce0617d',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );
    expect(cveFindingEntities.length).toBe(0);
    expect(cveFindingEntities).toMatchGraphObjectSchema({
      _class: TargetEntities.CVE._class,
    });
    expect(resources).toMatchSnapshot(resources);
  });
});
