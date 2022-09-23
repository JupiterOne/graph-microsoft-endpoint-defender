import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const activeDirectorySpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-account',
    name: 'Fetch Account',
    entities: [
      {
        resourceName: 'Account',
        _type: 'microsoft_defender_account',
        _class: ['Account'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'microsoft_defender_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_defender_account_has_user',
        sourceType: 'microsoft_defender_account',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_defender_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
