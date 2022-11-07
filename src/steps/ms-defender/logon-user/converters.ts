import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { UserLogon } from '../../../types';
import { Entities } from '../../../constants';

/**
 * Creates the Logon User entity.
 * @param data
 * @param machineId
 */
export function createLogonUserEntity(
  data: UserLogon,
  machineId: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: `${Entities.LOGON_USER._type}:${data.id}:${machineId}`,
        _class: Entities.LOGON_USER._class,
        _type: Entities.LOGON_USER._type,
        id: data.id,
        name: data.accountName,
        domain: data.accountDomain,
        username: data.accountName,
        displayName: data.accountName as string,
        firstSeenOn: parseTimePropertyValue(data.firstSeen),
        lastSeenOn: parseTimePropertyValue(data.lastSeen),
        logonTypes: data.logonTypes,
        active: true,
      },
    },
  });
}

export function createMachineLogonUserRelationship({
  machineEntity,
  logonUserEntity,
}: {
  machineEntity: Entity;
  logonUserEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: machineEntity,
    to: logonUserEntity,
  });
}
