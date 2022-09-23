export interface Machine {
  id: string;
  computerDnsName: string;
  firstSeen: string;
  lastSeen: string;
  onboardingStatus: string;
  healthStatus: string;
  deviceValue: string;
  agentVersion: string;
  defenderAvStatus: string;
  riskScore: string;
  osPlatform: string;
  osVersion?: string | null;
  osProcessor: string;
  version: string;
  lastIpAddress: string;
  lastExternalIpAddress: string;
  osBuild: number;
  rbacGroupId: number;
  rbacGroupName: string;
  exposureLevel: string;
  isAadJoined: boolean;
  aadDeviceId: string | null;
  machineTags: string[];
  osArchitecture: string;
  managedBy: string;
  managedByStatus: string;
  ipAddresses: IpAddress[];
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
  accountSid: string | null;
  firstSeen: string;
  lastSeen: string;
  mostPrevalentMachineId: string | null;
  leastPrevalentMachineId: string | null;
  logonTypes: string;
  logOnMachinesCount: number | null;
  isDomainAdmin: boolean;
  isOnlyNetworkUser: boolean | null;
}

export interface Finding {
  id: string;
  name: string;
  description: string;
  severity: string;
  cvssV3: number;
  exposedMachines: number;
  publishedOn: string;
  updatedOn: string;
  publicExploit: boolean;
  exploitVerified: boolean;
  exploitInKit: boolean;
  exploitTypes: string[];
  exploitUris: string[];
}
