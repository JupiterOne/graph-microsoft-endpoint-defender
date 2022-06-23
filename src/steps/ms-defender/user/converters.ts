import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { User } from '@microsoft/microsoft-graph-types';
import { UserLogon } from '../../../types';
import { entities } from '../constants';

export function generateUserKey(user: User): string {
  return user.id as string;
}

export function createUserEntity(data: UserLogon): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: data.id,
        _class: entities.USER._class,
        _type: entities.USER._type,
        id: data.id,
        name: data.accountName,
        domain: data.accountDomain,
        username: data.accountName,
        displayName: data.accountName as string,
        firstSeen: data.firstSeen,
        lastSeen: data.lastSeen,
        logonTypes: data.logonTypes,
        active: data.isDomainAdmin,
      },
    },
  });
}

export function createMachineUserRelationship(
  machine: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: machine,
    to: user,
  });
}
