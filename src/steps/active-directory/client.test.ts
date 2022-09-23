import {
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import { ActiveDirectoryClient } from './client';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetchOrganization', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetchOrganization',
  });

  const client = new ActiveDirectoryClient(
    createMockIntegrationLogger(),
    integrationConfig,
  );

  const organization = await client.fetchOrganization();

  expect(organization).toMatchObject({
    displayName: expect.any(String),
  });
});
