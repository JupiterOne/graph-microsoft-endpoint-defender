import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Endpoint, IpAddress, Machine } from '../../../types';
import { Entities } from '../../../constants';
import { uniq, compact } from 'lodash';
import { assignEndpoint, assignMachine } from '../../../entities';

export function createMachineEntity(data: Machine): Entity {
  const macAddress = extractUniquePublicMacAddresses(data.ipAddresses);

  const ipAddress = compact(
    uniq((data.ipAddresses ?? []).map((ip) => ip.ipAddress)),
  ).filter((ip) => !ipAddressesToFilter.includes(ip));
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: assignMachine({
        _key: `${Entities.MACHINE._type}:${data.id}`,
        id: data.id,
        firstSeenOn: parseTimePropertyValue(data.firstSeen),
        lastSeenOn: parseTimePropertyValue(data.lastSeen) ?? null,
        agentVersion: data.agentVersion,
        defenderAvStatus: data.defenderAvStatus,
        riskScore: data.riskScore,
        name:
          data.computerDnsName ||
          `${data.managedBy || 'Unknown User'}'s Device`,
        computerDnsName: data.computerDnsName,
        displayName:
          data.computerDnsName ||
          `${data.managedBy || 'Unknown User'}'s Device`,
        rbacGroupId: data.rbacGroupId,
        rbacGroupName: data.rbacGroupName,
        machineTags: data.machineTags,
        onboardingStatus: data.onboardingStatus,
        managedBy: data.managedBy,
        managedByStatus: data.managedByStatus,
        ipAddress: ipAddress,
        macAddress: macAddress,
        aadDeviceId: data.aadDeviceId,
        function: [
          'endpoint-compliance',
          'endpoint-configuration',
          'endpoint-protection',
          'anti-malware',
          'vulnerability-detection',
          'container-security',
        ],
      }),
    },
  });
}

export function createEndpointEntity(data: Endpoint): Entity {
  const macAddress = extractUniquePublicMacAddresses(data.ipAddresses);

  const ipAddress = compact(
    uniq((data.ipAddresses ?? []).map((ip) => ip.ipAddress)),
  ).filter((ip) => !ipAddressesToFilter.includes(ip));
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: assignEndpoint({
        _key: `${Entities.ENDPOINT._type}.${data.id}`,
        id: data.id,
        name:
          data.computerDnsName ||
          data.name ||
          `${data.managedBy || 'Unknown User'}'s Device`,
        computerDnsName: data.computerDnsName,
        firstSeenOn: parseTimePropertyValue(data.firstSeen),
        lastSeenOn: parseTimePropertyValue(data.lastSeen) ?? null,
        osPlatform: data.osPlatform,
        osVersion: data.osVersion || undefined,
        osProcessor: data.osProcessor || undefined,
        version: data.version,
        lastIpAddress: data.lastIpAddress,
        lastExternalIpAddress: data.lastExternalIpAddress,
        agentVersion: data.agentVersion,
        osBuild: data.osBuild,
        healthStatus: data.healthStatus,
        deviceValue: data.deviceValue,
        rbacGroupId: data.rbacGroupId,
        rbacGroupName: data.rbacGroupName,
        riskScore: data.riskScore,
        exposureLevel: data.exposureLevel,
        isAadJoined: data.isAadJoined,
        aadDeviceId: data.aadDeviceId,
        machineTags: data.machineTags,
        defenderAvStatus: data.defenderAvStatus,
        onboardingStatus: data.onboardingStatus,
        osArchitecture: data.osArchitecture,
        managedBy: data.managedBy,
        managedByStatus: data.managedByStatus,
        vmId: data.vmMetadata?.vmId,
        cloudProvider: data.vmMetadata?.cloudProvider,
        resourceId: data.vmMetadata?.resourceId,
        subscriptionId: data.vmMetadata?.subscriptionId,
        ipAddresses: data.ipAddresses
          ? data.ipAddresses.map((ip) => ip.ipAddress)
          : [],
        category: 'endpoint',
        ipAddress,
        macAddress,
        make: null,
        model: null,
        serial: null,
        deviceId: data.id,
      }),
    },
  });
}

export function createAccountMachineRelationship({
  accountEntity,
  machineEntity,
}: {
  accountEntity: Entity;
  machineEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: accountEntity,
    to: machineEntity,
  });
}

export function createMachineEndpointRelationship({
  machineEntity,
  endpointEntity,
}: {
  machineEntity: Entity;
  endpointEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.MANAGES,
    from: machineEntity,
    to: endpointEntity,
  });
}

/**
 * Extracts unique MAC addresses from a list of IP address objects, filtering out
 * internal (private) IPs and ignoring SoftwareLoopback types.
 *
 * Private IP ranges:
 * - 10.0.0.0 to 10.255.255.255
 * - 172.16.0.0 to 172.31.255.255
 * - 192.168.0.0 to 192.168.255.255
 */
export function extractUniquePublicMacAddresses(
  ipAddresses?: IpAddress[],
): string[] {
  const uniqueMacAddresses = new Set<string>(); // Using a Set to ensure uniqueness

  ipAddresses?.forEach(({ ipAddress, macAddress, type }) => {
    // Ignore loopback addresses and entries without a MAC address
    if (type === 'SoftwareLoopback' || macAddress === null) return;

    // Check if the IP is a private IP and ignore MACs if they are
    if (
      /^10\./.test(ipAddress) || // Matches 10.x.x.x
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ipAddress) || // Matches 172.16.x.x to 172.31.x.x
      /^192\.168\./.test(ipAddress) || // Matches 192.168.x.x
      /^169\.254\./.test(ipAddress) // Matches 169.254.x.x (APIPA)
    ) {
      return;
    }

    uniqueMacAddresses.add(macAddress);
  });

  return Array.from(uniqueMacAddresses)
    .filter(isValidMacAddress)
    .map(formatValidMacAddress)
    .filter((mac) => !macAddressesToFilter.includes(mac));
}

/**
 * Legal macAddresses
 * "00:1B:44:11:3A:B7";
 * "00:1b:44:11:3a:b7";
 * "001B44113AB7";
 * "00-1B-44-11-3A-B7";
 */
function isValidMacAddress(macAddress) {
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/;
  return regex.test(macAddress);
}

/**
 * Formats a valid macAddress to match the structure of '00:00:00:00:00:00'
 */
const formatValidMacAddress = (macAddress: string) => {
  const formattedMacAddress = macAddress.replace(
    /([0-9A-Fa-f]{2})(?=[0-9A-Fa-f]{2})/g,
    '$1:',
  );
  return formattedMacAddress.toUpperCase(); // Uppercase because that is the industry standard thus making J1QL easier.
};
const macAddressesToFilter = [
  '00:00:00:00:00:00', // default macAddress
];
const ipAddressesToFilter = [
  '127.0.0.1', // localhost
  '::1', // localhost
];
