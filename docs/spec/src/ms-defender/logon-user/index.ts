import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../../src/config';

export const logonUserSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-logon-users',
    name: 'Fetch Logon Users',
    entities: [
      {
        resourceName: 'Logon User',
        _type: 'microsoft_defender_logon_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_defender_machine_has_logon_user',
        sourceType: 'microsoft_defender_machine',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_defender_logon_user',
      },
    ],
    dependsOn: ['fetch-machines'],
    implemented: true,
  },
];
