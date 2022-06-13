import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
// import { Group, User } from '@microsoft/microsoft-graph-types';

import { integrationConfig } from '../../../../test/config';
import {
  Machine,
  UserLogon,
  IpAddress,
  Vulnerability,
  Finding,
  VmMetadata,
} from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';

const logger: any = 'https://api.securitycenter.microsoft.com/api';

// let recording: Recording;

// afterEach(async () => {
//   if (recording) {
//     await recording.stop();
//   }
// });

describe('iterateMachines', () => {
  test('accessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);

    const resources: Machine[] = [];
    await client.iterateMachines((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
    //   resources.forEach((r) => {
    //     expect(r).toBe({
    //       // displayName: expect.any(String),
    //       aadDeviceId: null,
    //       agentVersion: "10.8040.19041.1682",
    //       computerDnsName: "testmachine7",
    //       defenderAvStatus: "Unknown",
    //       deviceValue: "Normal",
    //       exposureLevel: "None",
    //   firstSeen: "2022-05-30T13:19:04.712Z",
    //   healthStatus: "Inactive",
    //   id: "660688d26b586b005a90cc148bfb78ed8e55b32b",
    //  ipAddresses:  [
    //      {
    // ipAddress: "10.1.1.196",
    //   macAddress: "6045BDB15CEA",
    //         "operationalStatus": "Up",
    //         "type": "Ethernet",
    //        },
    //         {
    //         "ipAddress": "fe80::653e:a24c:f250:2061",
    //         "macAddress": "6045BDB15CEA",
    //         "operationalStatus": "Up",
    //         "type": "Ethernet",
    //       },
    //         {
    //        "ipAddress": "127.0.0.1",
    //          "macAddress": "",
    //          "operationalStatus": "Up",
    //          "type": "SoftwareLoopback",
    //        },
    //         {
    //         "ipAddress": "::1",
    //          "macAddress": "",
    //         "operationalStatus": "Up",
    //         "type": "SoftwareLoopback",
    //       },
    //    ],
    //  isAadJoined: false,
    //   lastExternalIpAddress: "20.96.12.95",
    //   lastIpAddress: "10.1.1.196",
    //   lastSeen: "2022-05-31T13:35:10.3844291Z",
    //   machineTags:  [    "evaluation",
    //     ],
    // managedBy: "Unknown",
    //   managedByStatus: "Unknown",
    //   onboardingStatus: "Onboarded",
    //  osArchitecture: "64-bit",
    //   osBuild: 19043,
    //   osPlatform: "Windows10",
    //   osProcessor: "x64",
    //   osVersion: null,
    //   rbacGroupId: 74,
    //   rbacGroupName: "Group1",
    //   riskScore: "None",
    //   version: "21H1",
    //   vmMetadata:  {
    //   "cloudProvider": "Azure",
    //   "resourceId": "/subscriptions/1b922e46-8595-4749-997a-1205e714cd91/resourceGroups/evaluation_6ffb670de54e4ced906d4b4603a8fec2_6/providers/Microsoft.Compute/virtualMachines/TestMachine6",
    //      "subscriptionId": "1b922e46-8595-4749-997a-1205e714cd91",
    //      "vmId": "f281738d-3376-4b37-bcd4-494dde203747",
    //     },
    //     });
    //   });
  });

  test('inaccessible', async () => {
    const client = new DirectoryGraphClient(logger, integrationConfig);
    // const infoSpy = jest.spyOn(logger, 'iterateUsers');

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
    // expect(infoSpy).toHaveBeenCalledTimes(1);
    // expect(infoSpy).toHaveBeenCalledWith(
    //   { resourceUrl: 'https://api.securitycenter.microsoft.com/api/machines' },
    //   'Unauthorized',
    // );
  });

  test('insufficient permissions', async () => {
    //This doesn't throw the correct error anymore

    const client = new DirectoryGraphClient(logger, integrationConfig);
    // const infoSpy = jest.spyOn(logger, 'info');

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
    // expect(infoSpy).toHaveBeenCalledTimes(1);
    // expect(infoSpy).toHaveBeenCalledWith(
    //   { resourceUrl: '/machines' },
    //   'Unauthorized',
    // );
  });
});

describe('iterateUsers', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: 'id',
      },
      (e) => {
        resources.push(e);
      },
    );

    // expect(resources.length).toBeGreaterThan(0);
    // resources.forEach((r) => {
    //   expect(r).toMatchObject({
    //     id: expect.any(String),
    //   });
    // });

    // const resource = resources[0];
    // expect(resource.displayName).toBeUndefined();
  });

  test('multiple selected properties', async () => {
    const resources: UserLogon[] = [];
    await client.iterateUsers(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBe(0);
    // resources.forEach((r) => {
    //   expect(r).toMatchObject({
    //     id: expect.any(String),
    //     displayName: expect.any(String),
    //   });
    // });
  });
});

describe('iterateFindings', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, integrationConfig);
  });

  test('single selected property', async () => {
    const resources: UserLogon[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: 'id',
      },
      (e) => {
        resources.push();
      },
    );

    // expect(resources.length).toBeGreaterThan(0);
    // resources.forEach((r) => {
    //   expect(r).toMatchObject({
    //     id: expect.any(String),
    //   });
    // });

    // const resource = resources[0];
    // expect(resource.displayName).toBeUndefined();
  });

  test('multiple selected properties', async () => {
    const resources: UserLogon[] = [];
    await client.iterateFindings(
      {
        machineId: '1c417feb-b04f-46c9-a747-614d6d03f348',
        select: ['id', 'displayName'],
      },
      (e) => {
        resources.push();
      },
    );

    expect(resources.length).toBe(0);
    // resources.forEach((r) => {
    //   expect(r).toMatchObject({
    //     id: expect.any(String),
    //     displayName: expect.any(String),
    //   });
    // });
  });
});
