import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';

import { integrationConfig } from '../../test/config';
import { GraphClient } from './client';
import { Recording, setupProjectRecording } from '../../test/recording';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

describe('verifyAuthentication', () => {
  test('invalid tenant', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'invalid tenant',
      options: {
        recordFailedRequests: true,
      },
    });
    const client = new GraphClient(createMockIntegrationLogger(), {
      ...integrationConfig,
      tenant: 'abc123testing',
    });

    await expect(client.verifyAuthentication()).rejects.toThrow(
      'Provider authentication failed at /organization: -1 AuthenticationRequiredError',
    );
  });

  test('inaccessible', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'inaccessible',
      options: {
        recordFailedRequests: true,
      },
    });
    const client = new GraphClient(createMockIntegrationLogger(), {
      ...integrationConfig,
      clientSecret: 'L3111~invalidinvalidinvalidiNh.qKinvalid',
    });

    await expect(client.verifyAuthentication()).rejects.toThrow(
      'Provider authentication failed at /organization: -1 AuthenticationRequiredError',
    );
  });
});
