import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Endpoint, Machine } from '../../../types';
import { Entities } from '../../../constants';
import { uniq, compact, flatMap } from 'lodash';

export function createMachineEntity(data: Machine): Entity {
  /**
   * An input of ['6045BD8016FF', '000000000000'] would return ["60:45:bd:80:16:ff","60:45:BD:80:16:FF"]
   */
  const macAddress = uniq(
    flatMap(
      (data.ipAddresses ?? [])
        .map((ip) => ip.macAddress)
        .filter(isValidMacAddress),
      formatValidMacAddress,
    ),
  ).filter((macAddress) => !macAddressesToFilter.includes(macAddress));

  const ipAddress = compact(
    uniq((data.ipAddresses ?? []).map((ip) => ip.ipAddress)),
  ).filter((ip) => !ipAddressesToFilter.includes(ip));

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.MACHINE._class,
        _type: Entities.MACHINE._type,
        _key: `${Entities.MACHINE._type}:${data.id}`,
        id: data.id,
        agentVersion: data.agentVersion,
        defenderAvStatus: data.defenderAvStatus,
        riskScore: data.riskScore,
        name: data.computerDnsName,
        computerDnsName: data.computerDnsName,
        displayName: data.computerDnsName as string,
        rbacGroupId: data.rbacGroupId,
        rbacGroupName: data.rbacGroupName,
        machineTags: data.machineTags,
        onboardingStatus: data.onboardingStatus,
        managedBy: data.managedBy,
        managedByStatus: data.managedByStatus,
        ipAddress: ipAddress,
        macAddress: macAddress,
        function: [
          'endpoint-compliance',
          'endpoint-configuration',
          'endpoint-protection',
          'anti-malware',
          'vulnerability-detection',
          'container-security',
        ],
      },
    },
  });
}

export function createEndpointEntity(data: Endpoint): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ENDPOINT._class,
        _type: Entities.ENDPOINT._type,
        _key: `${Entities.ENDPOINT._type}.${data.id}`,
        id: data.id,
        name: data.computerDnsName,
        computerDnsName: data.computerDnsName,
        firstSeenOn: parseTimePropertyValue(data.firstSeen),
        lastSeenOn: parseTimePropertyValue(data.lastSeen),
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
        make: 'unknown',
        model: 'unknown',
        serial: 'unknown',
        deviceId: 'unknown',
      },
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
  return [
    formattedMacAddress.toLowerCase(), // Lowercase to match the macAddress of aws_ami(s)..
    formattedMacAddress.toUpperCase(), // Uppercase because that is the industry standard thus making J1QL easier.
  ];
};
const macAddressesToFilter = [
  '00:00:00:00:00:00', // default macAddress
];
const ipAddressesToFilter = [
  '127.0.0.1', // localhost
  '::1', // localhost
];
