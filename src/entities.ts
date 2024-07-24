import { SchemaType } from '@jupiterone/integration-sdk-core';
import { createEntityType, createEntityMetadata } from './helpers';

const StringNullUndefined = SchemaType.Optional(
  SchemaType.Union([SchemaType.String(), SchemaType.Null()]),
);

export const [ACCOUNT_ENTITY, assignAccount] = createEntityMetadata({
  resourceName: 'Account',
  _class: ['Account'],
  _type: createEntityType('account'),
  description: 'A Microsoft Defender Endpoint account',
  schema: SchemaType.Object({
    organizationName: StringNullUndefined,
    defaultDomain: SchemaType.Optional(SchemaType.String()),
    verifiedDomains: SchemaType.Optional(SchemaType.Array(SchemaType.String())),
  }),
});

export const [MACHINE_ENTITY, assignMachine] = createEntityMetadata({
  resourceName: 'Machine',
  _class: ['HostAgent'],
  _type: createEntityType('machine'),
  description: 'A Microsoft Defender Endpoint machine',
  schema: SchemaType.Object({
    firstSeenOn: SchemaType.Optional(SchemaType.Number()),
    agentVersion: SchemaType.String(),
    defenderAvStatus: SchemaType.String(),
    riskScore: SchemaType.String(),
    computerDnsName: SchemaType.String(),
    rbacGroupId: SchemaType.Number(),
    rbacGroupName: SchemaType.Union([SchemaType.String(), SchemaType.Null()]),
    machineTags: SchemaType.Array(SchemaType.String()),
    onboardingStatus: SchemaType.String(),
    managedBy: SchemaType.String(),
    managedByStatus: SchemaType.String(),
    ipAddress: SchemaType.Array(SchemaType.String()),
    macAddress: SchemaType.Array(SchemaType.String()),
    aadDeviceId: SchemaType.Union([SchemaType.String(), SchemaType.Null()]),
  }),
});

export const [LOGON_USER_ENTITY, assignLogonUser] = createEntityMetadata({
  resourceName: 'Logon User',
  _class: ['User'],
  _type: createEntityType('logon_user'),
  description: 'A Microsoft Defender Endpoint Logon User',
  schema: SchemaType.Object({
    domain: StringNullUndefined,
    firstSeenOn: SchemaType.Optional(SchemaType.Number()),
    lastSeenOn: SchemaType.Optional(SchemaType.Number()),
    logonTypes: SchemaType.String(),
  }),
});

export const [USER_ENTITY, assignUser] = createEntityMetadata({
  resourceName: 'User',
  _class: ['User'],
  _type: createEntityType('user'),
  description: 'A Microsoft Defender Endpoint user',
  schema: SchemaType.Object({
    businessPhones: SchemaType.Optional(SchemaType.Array(SchemaType.String())),
    givenName: StringNullUndefined,
    jobTitle: StringNullUndefined,
    mail: StringNullUndefined,
    mobilePhone: StringNullUndefined,
    officeLocation: StringNullUndefined,
    preferredLanguage: StringNullUndefined,
    surname: StringNullUndefined,
    userPrincipalName: StringNullUndefined,
  }),
});

export const [VULNERABILITY_ENTITY, assignVulnerability] = createEntityMetadata(
  {
    resourceName: 'Vulnerability',
    _class: ['Finding'],
    _type: createEntityType('vulnerability'),
    description: 'A Microsoft Defender Endpoint vulnerability',
    schema: SchemaType.Object({
      id: SchemaType.String(),
      publishedOn: SchemaType.Optional(SchemaType.Number()),
      exposedMachines: SchemaType.Number(),
      blocking: SchemaType.Boolean(),
    }),
  },
);

export const [ENDPOINT_ENTITY, assignEndpoint] = createEntityMetadata({
  resourceName: 'Device/Machine/Host',
  _class: ['Device'],
  _type: 'user_endpoint',
  description: 'A Microsoft Defender Endpoint entity',
  schema: SchemaType.Object({
    computerDnsName: SchemaType.String(),
    firstSeenOn: SchemaType.Optional(SchemaType.Number()),
    osPlatform: SchemaType.String(),
    osProcessor: SchemaType.Optional(SchemaType.String()),
    lastIpAddress: SchemaType.String(),
    lastExternalIpAddress: SchemaType.String(),
    agentVersion: SchemaType.String(),
    osBuild: SchemaType.Union([SchemaType.Number(), SchemaType.Null()]),
    healthStatus: SchemaType.String(),
    deviceValue: SchemaType.String(),
    rbacGroupId: SchemaType.Number(),
    rbacGroupName: SchemaType.Union([SchemaType.String(), SchemaType.Null()]),
    riskScore: SchemaType.String(),
    exposureLevel: SchemaType.String(),
    isAadJoined: SchemaType.Union([SchemaType.Boolean(), SchemaType.Null()]),
    aadDeviceId: SchemaType.Union([SchemaType.String(), SchemaType.Null()]),
    machineTags: SchemaType.Array(SchemaType.String()),
    defenderAvStatus: SchemaType.String(),
    onboardingStatus: SchemaType.String(),
    osArchitecture: SchemaType.String(),
    managedBy: SchemaType.String(),
    managedByStatus: SchemaType.String(),
    vmId: SchemaType.Optional(SchemaType.String()),
    cloudProvider: SchemaType.Optional(SchemaType.String()),
    resourceId: SchemaType.Optional(SchemaType.String()),
    subscriptionId: SchemaType.Optional(SchemaType.String()),
    ipAddresses: SchemaType.Array(SchemaType.String()),
    ipAddress: SchemaType.Array(SchemaType.String()),
    macAddress: SchemaType.Array(SchemaType.String()),
  }),
});
