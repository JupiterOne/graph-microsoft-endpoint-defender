import {
  IntegrationInstanceConfig,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The Azure application client ID used to identify the program as the
   * registered app. This will be the same for all tenants since this is a
   * multi-tenant application.
   */
  clientId: string;

  /**
   * The Azuser application client secret used to authenticate requests.
   */
  clientSecret: string;

  /**
   * The target directory/tenant ID, identified during the admin consent OAuth
   * flow.
   */
  tenant: string;

  /**
   * This is to differentiate between the azure api vs defender api **/
  isDefenderApi: boolean;
}

/**
 * An `IntegrationStepExecutionContext` typed for this integration's
 * `IntegrationInstanceConfig`.
 */
export type IntegrationStepContext =
  IntegrationStepExecutionContext<IntegrationConfig>;

export interface Machine {
  id: string;
  computerDnsName: string;
  firstSeen: string;
  lastSeen: string;
  classification: string;
  onboardingStatus: string;
  healthStatus: string;
  deviceValue: string;
  agentVersion: string;
  defenderAvStatus: string;
  riskScore: string;
  osPlatform: string;
  osVersion: any;
  osProcessor: string;
  version: string;
  lastIpAddress: string;
  lastExternalIpAddress: string;
  osBuild: number;
  rbacGroupId: number;
  rbacGroupName: string;
  exposureLevel: string;
  isAadJoined: boolean;
  aadDeviceId: any;
  machineTags: Array<string>;
  osArchitecture: string;
  managedBy: string;
  managedByStatus: string;
  ipAddresses: Array<IpAddress>;
  vmMetadata: VmMetadata;
}

export interface IpAddress {
  ipAddress: string;
  macAddress: string;
  type: string;
  operationalStatus: string;
}

export interface VmMetadata {
  vmId: string;
  cloudProvider: string;
  resourceId: string;
  subscriptionId: string;
}

export interface UserLogon {
  id: string;
  accountName: string;
  accountDomain: string;
  firstSeen: string;
  lastSeen: string;
  logonTypes: string;
  healthStatus: string;
  deviceValue: string;
  agentVersion: string;
  defenderAvStatus: string;
  isDomainAdmin: boolean;
  logOnMachinesCount: any;
  isOnlyNetworkUser: any;
  accountSid: any;
}

export interface Vulnerability {
  id: any;
  name: string;
  description: string;
  severity: string;
  cvssV3: any;
  exposedMachines: string;
  publishedOn: any;
  updatedOn: any;
  publicExploit: boolean;
  exploitVerified: boolean;
  exploitInKit: false;
  exploitTypes: Array<string>;
  exploitUris: Array<string>;
}

export interface Finding {
  id: any;
  name: string;
  description: string;
  severity: string;
  cvssV3: any;
  exposedMachines: string;
  publishedOn: any;
  updatedOn: any;
  publicExploit: boolean;
  exploitVerified: boolean;
  exploitInKit: false;
  exploitTypes: Array<string>;
  exploitUris: Array<string>;
}
