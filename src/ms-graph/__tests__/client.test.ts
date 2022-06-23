import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';

import { integrationConfig } from '../../../test/config';
import { GraphClient } from '../client';
import { IntegrationConfig } from '../../../src/config';
import { Recording, setupProjectRecording } from '../../../test/recording';

const DEFAULT_CLIENT_ID = 'dummy-acme-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';
const DEFAULT_TENANT = 'dummy-tenant';

const config: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
  tenant: process.env.TENANT || DEFAULT_TENANT,
};
const logger = createMockIntegrationLogger();

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});

describe('verifyAuthentication', () => {
  test('invalid tenant', async () => {
    const client = new GraphClient(logger, {
      ...integrationConfig,
      tenant: 'abc123testing',
    });

    await expect(client.verifyAuthentication()).rejects.toThrow(
      'Provider authentication failed at /organization: -1 AuthenticationError',
    );
  });

  test('inaccesible', async () => {
    const client = new GraphClient(logger, {
      ...integrationConfig,
      isDefenderApi: true,
    });

    await expect(client.verifyAuthentication()).rejects.toThrow(
      'Provider authentication failed at /organization: 401 InvalidAuthenticationToken',
    );
  });
});

test('fetchMetadata', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetchMetadata',
  });

  const client = new GraphClient(logger, config);

  const metadata = await client.fetchMetadata();
  expect(metadata).toMatchObject({
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata',
  });
});

describe('fetchOrganization', () => {
  test('accessible', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetchOrganization',
    });

    const client = new GraphClient(logger, config);

    const organization = await client.fetchOrganization();

    expect(organization).toMatchObject({
      displayName: expect.any(String),
    });
  });

  test('inaccessible', async () => {
    const client = new GraphClient(logger, {
      ...integrationConfig,
      isDefenderApi: true,
    });

    await expect(client.fetchOrganization()).rejects.toThrow(
      'Provider authorization failed at /organization: 401 InvalidAuthenticationToken',
    );
  });
});
