import { integrationConfig } from '../../../../test/config';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { Machine, UserLogon } from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';

const logger: any = 'https://api.securitycenter.microsoft.com/api';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  recording ? await recording.stop() : null;
});

describe('iterateMachines', () => {
  test('accessible', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateMachines',
    });

    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
  });

  test('inaccessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push();
      },
    );

    expect(resources.length).toEqual(0);
  });

  test('insufficient permissions', async () => {
    //This doesn't throw the correct error anymore

    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push();
      },
    );

    expect(resources.length).toEqual(0);
  });
});

describe('iterateUsers', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateUsers_single_properties',
    });

    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: 'f8c2d6c26063babf52bc76979ef22f423387f3b2',
      },
      (e) => {
        resources.push(e);
      },
    );
  });
});

describe('iterateFindings', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'iterateFindings_single_properties',
    });

    const resources: UserLogon[] = [];
    await client.iterateFindings(
      {
        machineId: '660688d26b586b005a90cc148bfb78ed8e55b32b',
      },
      (e) => {
        resources.push();
      },
    );
  });
});
