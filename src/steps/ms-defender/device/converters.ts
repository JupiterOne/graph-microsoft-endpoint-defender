import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  createMappedRelationship,
} from '@jupiterone/integration-sdk-core';
import { Machine } from '../../../types';
import { entities, MappedRelationships, TargetEntities } from '../constants';

export function createAccountMachineRelationship(
  account: Entity,
  machine: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: machine,
  });
}
export function createMachineEntity(data: Machine): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {}, // removed due to size
      assign: {
        _class: entities.MACHINE._class,
        _type: entities.MACHINE._type,
        _key: data.id!,
        id: data.id,
        agentVersion: data.agentVersion,
        defenderAvStatus: data.defenderAvStatus,
        riskScore: data.riskScore,
        name: data.computerDnsName,
        computerDnsName: data.computerDnsName,
        displayName: data.computerDnsName as string,
        function: ['endpoint-protection', 'vulnerability-detection'],
      },
    },
  });
}

export function createMachinesDeviceRelationship(data: Entity): Relationship {
  return createMappedRelationship({
    // source: data,
    _class: RelationshipClass.MANAGES,
    _type: MappedRelationships.MACHINE_MANAGES_DEVICE._type,
    _mapping: {
      sourceEntityKey: data._key,
      relationshipDirection:
        MappedRelationships.MACHINE_MANAGES_DEVICE.direction,
      targetFilterKeys: [['_type', '_class', 'hostname']],
      targetEntity: {
        _class: TargetEntities.DEVICE._class,
        _type: TargetEntities.DEVICE._type,
        displayName: data.computerDnsName as string,
        name: data.displayName,
        id: data.id,
        category: 'endpoint',
        fqdn: data.computerDnsName as string,
        hostname: data.computerDnsName as string,
        osName: data.osPlatform as string,
        osVersion: data.osVersion as string,
        platform: data.osPlatform as string,
      },
      skipTargetCreation: true,
    },
  });
}
