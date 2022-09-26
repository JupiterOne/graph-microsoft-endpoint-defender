import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Machine } from '../../../types';
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
