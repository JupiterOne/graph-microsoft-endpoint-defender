import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  IntegrationInstance,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Organization, User } from '@microsoft/microsoft-graph-types';
import { Entities } from '../../constants';
import { assignAccount, assignUser } from '../../entities';

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
      assign: assignAccount({
        _key: `${Entities.ACCOUNT._type}:${instance.id}`,
        id: organization.id,
        name: organization.displayName ?? instance.name,
        displayName: instance.name,
        organizationName: organization.displayName,
        defaultDomain,
        verifiedDomains,
        vendor: 'Microsoft Defender',
      }),
    },
  });
}

export function createUserEntity(data: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: assignUser({
        _key: `${Entities.USER._type}:${data.id}`,
        id: data.id,
        name: data.displayName || '',
        username: data.userPrincipalName || '',
        businessPhones: data.businessPhones,
        displayName: data.displayName || '',
        givenName: data.givenName,
        jobTitle: data.jobTitle,
        mail: data.mail,
        mobilePhone: data.mobilePhone,
        officeLocation: data.officeLocation,
        preferredLanguage: data.preferredLanguage,
        surname: data.surname,
        userPrincipalName: data.userPrincipalName,
        active: true,
      }),
    },
  });
}

export function createAccountUserRelationship({
  accountEntity,
  userEntity,
}: {
  accountEntity: Entity;
  userEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: accountEntity,
    to: userEntity,
  });
}
