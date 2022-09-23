import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../../src/config';

export const machineSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-machines',
    name: 'Fetch Machines',
    entities: [
      {
        resourceName: 'Machine',
        _type: 'microsoft_defender_machine',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_defender_account_has_machine',
        sourceType: 'microsoft_defender_account',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_defender_machine',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
