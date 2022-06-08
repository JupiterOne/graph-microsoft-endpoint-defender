import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  IntegrationInstance,
  Relationship,
  RelationshipClass,
  createMappedRelationship,
  getTime,
} from '@jupiterone/integration-sdk-core';
import { Organization, User } from '@microsoft/microsoft-graph-types';
import { Finding, Machine, UserLogon } from '../../model';
import { entities, MappedRelationships, TargetEntities } from './constants';

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
  intuneConfig: {
    mobileDeviceManagementAuthority?: string;
    subscriptionState?: string;
    intuneAccountID?: string;
  },
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
        intuneConfig,
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
        intuneAccountId: intuneConfig?.intuneAccountID,
        mobileDeviceManagementAuthority:
          intuneConfig?.mobileDeviceManagementAuthority,
        intuneSubscriptionState: intuneConfig?.subscriptionState,
      },
    },
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
        displayName: data.computerDnsName as string | undefined,
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
        displayName: data.computerDnsName as string | undefined,
        name: data.displayName,
        id: data.id,
        category: 'endpoint',
        fqdn: data.computerDnsName as string | undefined,
        hostname: data.computerDnsName as string | undefined,
        osName: data.osPlatform as string | undefined,
        osVersion: data.osVersion as string | undefined,
        platform: data.osPlatform as string | undefined,
      },
      skipTargetCreation: true,
    },
  });
}

export function generateUserKey(user: User): string {
  return user.id as string;
}

export function createUserEntity(data: UserLogon): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {}, // removed due to size
      assign: {
        _key: generateUserKey(data),
        _class: entities.USER._class,
        _type: entities.USER._type,
        id: data.id,
        name: data.accountName,
        domain: data.accountDomain,
        username: data.accountName,
        displayName: data.accountName as string | undefined,
        firstSeen: data.firstSeen,
        lastSeen: data.lastSeen,
        logonTypes: data.logonTypes,
        active: data.isDomainAdmin,
      },
    },
  });
}

export function createFindingEntity(defenderFinding: Finding): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        id: defenderFinding.id,
        _type: entities.FINDING._type,
        _class: entities.FINDING._class,
        _key: defenderFinding.id + '_' + Math.random() * 1000000,
        name: defenderFinding.name,
        displayName: defenderFinding.name,
        description: defenderFinding.description,
        severity: defenderFinding.severity,
        score: defenderFinding.cvssV3,
        numericSeverity: 0,
        publishedOn: defenderFinding.publishedOn,
        updatedOn: getTime(defenderFinding.updatedOn),
        category: '',
        open: true,
        references: defenderFinding.exploitUris,
        exposedMachines: defenderFinding.exposedMachines,
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

export function createMachineFindingsRelationship(
  machine: Entity,
  finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IDENTIFIED,
    from: machine,
    to: finding,
  });
}

export function createFindingsCveRelationship(
  findingEntity: Entity,
): Relationship {
  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.FINDING_IS_CVE_VULNERABILITY._type,
    _mapping: {
      sourceEntityKey: findingEntity._key,
      relationshipDirection:
        MappedRelationships.FINDING_IS_CVE_VULNERABILITY.direction,
      targetFilterKeys: [['Resource', '_type', '_class', '_key']],
      targetEntity: {
        _class: TargetEntities.CVE._class,
        _type: TargetEntities.CVE._type,
        _key: `cve_${findingEntity._key}`,
        Resource: TargetEntities.CVE.resourceName,
        displayName: findingEntity.displayName,
      },
      skipTargetCreation: true,
    },
  });
}
