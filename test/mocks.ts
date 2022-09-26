import { IntegrationInstance } from '@jupiterone/integration-sdk-core';
import { Organization, User } from '@microsoft/microsoft-graph-types';
import { Machine, UserLogon, Vulnerability } from '../src/types';
import { integrationConfig } from './config';

export function getMockInstance(): IntegrationInstance {
  return {
    id: '12345678-53ed-4ed9-be02-aed28f11edbd',
    accountId: '',
    name: 'DefenderAccount',
    integrationDefinitionId: '',
    config: integrationConfig,
  };
}

export function getMockUser(): User {
  return {
    businessPhones: [],
    displayName: 'Test user',
    givenName: null,
    jobTitle: null,
    mail: null,
    mobilePhone: null,
    officeLocation: null,
    preferredLanguage: null,
    surname: null,
    userPrincipalName: 'user@domain.onmicrosoft.com',
    id: '12345678-cd5a-4689-a498-571234567890',
  };
}

export function getMockOrganization(): Organization {
  return {
    id: '12345605-53ed-4ed9-1234-1234567890bd',
    deletedDateTime: null,
    businessPhones: ['1234567890'],
    city: 'hyderabad',
    country: null,
    countryLetterCode: 'IN',
    createdDateTime: '2022-05-17T07:48:01Z',
    displayName: 'learning',
    marketingNotificationEmails: [],
    onPremisesLastSyncDateTime: null,
    onPremisesSyncEnabled: null,
    postalCode: '123123',
    preferredLanguage: 'en',
    securityComplianceNotificationMails: [],
    securityComplianceNotificationPhones: [],
    state: 'telangana',
    street: 'test',
    technicalNotificationMails: ['sample@email.onmicrosoft.com'],
    tenantType: 'AAD',
    privacyProfile: null,
    assignedPlans: [
      {
        assignedDateTime: '2022-08-27T12:18:53Z',
        capabilityStatus: 'Deleted',
        service: 'Adallom',
        servicePlanId: '932ad362-64a8-4783-9106-97849a1a30b9',
      },
      {
        assignedDateTime: '2022-08-27T12:18:53Z',
        capabilityStatus: 'Deleted',
        service: 'AADPremiumService',
        servicePlanId: '41781fb2-bc02-4b7c-bd55-b576c07bb09d',
      },
      {
        assignedDateTime: '2022-08-27T12:18:53Z',
        capabilityStatus: 'Deleted',
        service: 'AADPremiumService',
        servicePlanId: 'eec0eb4f-6444-4f95-aba0-50c24d67f998',
      },
      {
        assignedDateTime: '2022-08-27T12:18:53Z',
        capabilityStatus: 'Deleted',
        service: 'MultiFactorService',
        servicePlanId: '8a256a2b-b617-496d-b51b-e76466e88db0',
      },
      {
        assignedDateTime: '2022-05-17T07:50:29Z',
        capabilityStatus: 'Enabled',
        service: 'SCO',
        servicePlanId: '1689aade-3d6a-4bfc-b017-46d2672df5ad',
      },
      {
        assignedDateTime: '2022-05-17T07:50:29Z',
        capabilityStatus: 'Enabled',
        service: 'exchange',
        servicePlanId: '113feb6c-3fe4-4440-bddc-54d774bf0318',
      },
      {
        assignedDateTime: '2022-05-17T07:50:29Z',
        capabilityStatus: 'Enabled',
        service: 'WindowsDefenderATP',
        servicePlanId: '871d91ec-ec1a-452b-a83f-bd76c7d770ef',
      },
    ],
    provisionedPlans: [
      {
        capabilityStatus: 'Suspended',
        provisioningStatus: 'Success',
        service: 'Adallom',
      },
      {
        capabilityStatus: 'Enabled',
        provisioningStatus: 'Success',
        service: 'SCO',
      },
      {
        capabilityStatus: 'Enabled',
        provisioningStatus: 'Success',
        service: 'exchange',
      },
      {
        capabilityStatus: 'Enabled',
        provisioningStatus: 'Success',
        service: 'exchange',
      },
    ],
    verifiedDomains: [
      {
        capabilities: 'Email, OfficeCommunicationsOnline',
        isDefault: true,
        isInitial: true,
        name: 'defendertest1.onmicrosoft.com',
        type: 'Managed',
      },
    ],
  };
}

export function getMockMachine(): Machine {
  return {
    id: '1234567890123456789076979ef22f423387f3b2',
    computerDnsName: 'testmachine1',
    firstSeen: '2022-05-17T08:23:16.144Z',
    lastSeen: '2022-05-19T08:38:59.1749659Z',
    osPlatform: 'Windows10',
    osVersion: null,
    osProcessor: 'x64',
    version: '21H1',
    lastIpAddress: '10.1.1.68',
    lastExternalIpAddress: '20.242.16.66',
    agentVersion: '10.8040.19041.1682',
    osBuild: 19043,
    healthStatus: 'Inactive',
    deviceValue: 'Normal',
    rbacGroupId: 74,
    rbacGroupName: 'Group1',
    riskScore: 'High',
    exposureLevel: 'None',
    isAadJoined: false,
    aadDeviceId: null,
    machineTags: ['evaluation'],
    defenderAvStatus: 'Unknown',
    onboardingStatus: 'Onboarded',
    osArchitecture: '64-bit',
    managedBy: 'Unknown',
    managedByStatus: 'Unknown',
    ipAddresses: [
      {
        ipAddress: '10.1.1.68',
        macAddress: '6045BDB28CAB',
        type: 'Ethernet',
        operationalStatus: 'Up',
      },
      {
        ipAddress: 'fe80::d4ca:d52c:2960:cdca',
        macAddress: '6045BDB28CAB',
        type: 'Ethernet',
        operationalStatus: 'Up',
      },
      {
        ipAddress: '127.0.0.1',
        macAddress: '',
        type: 'SoftwareLoopback',
        operationalStatus: 'Up',
      },
      {
        ipAddress: '::1',
        macAddress: '',
        type: 'SoftwareLoopback',
        operationalStatus: 'Up',
      },
    ],
    vmMetadata: {
      vmId: '12345678-008e-44c2-b003-123456789072',
      cloudProvider: 'Azure',
      resourceId:
        '/subscriptions/1b922e46-8595-4749-997a-123456789091/resourceGroups/evaluation_6ffb670de54e4ced906d4b4603a8fec2_1/providers/Microsoft.Compute/virtualMachines/TestMachine1',
      subscriptionId: '12345678-8595-1234-997a-1205e714cd91',
    },
  };
}

export function getMockLogonUser(): UserLogon {
  return {
    id: 'machine1\\admin1',
    accountName: 'administrator1',
    accountDomain: 'testmachine1',
    accountSid: null,
    firstSeen: '2022-09-13T09:00:15Z',
    lastSeen: '2022-09-13T09:00:22Z',
    mostPrevalentMachineId: null,
    leastPrevalentMachineId: null,
    logonTypes: 'Network, RemoteInteractive',
    logOnMachinesCount: null,
    isDomainAdmin: true,
    isOnlyNetworkUser: null,
  };
}

export function getMockVulnerability(): Vulnerability {
  return {
    id: 'CVE-2022-34731',
    name: 'CVE-2022-34731',
    description:
      'Microsoft OLE DB Provider for SQL Server Remote Code Execution Vulnerability',
    severity: 'High',
    cvssV3: 8.8,
    exposedMachines: 1,
    publishedOn: '2022-09-13T00:00:00Z',
    updatedOn: '2022-09-13T20:43:00Z',
    publicExploit: false,
    exploitVerified: false,
    exploitInKit: false,
    exploitTypes: [],
    exploitUris: [],
  };
}
