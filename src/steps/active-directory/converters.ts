import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  IntegrationInstance,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Organization } from '@microsoft/microsoft-graph-types';
import { entities } from './constants';

export function createAccountEntity(instance: IntegrationInstance): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _class: entities.ACCOUNT._class,
        _key: `${entities.ACCOUNT._type}-${instance.id}`,
        _type: entities.ACCOUNT._type,
        name: instance.name,
        displayName: instance.name,
      },
    },
  });
}

export function createAccountEntityWithOrganization(
  instance: IntegrationInstance,
  organization: Organization,
): Entity {
  let defaultDomain: string | undefined;
  const verifiedDomains = organization.verifiedDomains?.map((e) => {
    if (e.isDefault) {
      defaultDomain = e.name as string | undefined;
    }
    return e.name as string;
  });

  return createIntegrationEntity({
    entityData: {
      source: {
        organization,
      },
      assign: {
        _class: entities.ACCOUNT._class,
        _key: `${entities.ACCOUNT._type}-${instance.id}`,
        _type: entities.ACCOUNT._type,
        id: organization.id,
        name: organization.displayName,
        displayName: instance.name,
        organizationName: organization.displayName,
        defaultDomain,
        verifiedDomains,
      },
    },
  });
}
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
