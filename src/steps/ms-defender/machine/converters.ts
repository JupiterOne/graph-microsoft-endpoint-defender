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

export function createMachineEntity(data: Machine): Entity {
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
