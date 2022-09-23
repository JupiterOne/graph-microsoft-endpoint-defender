import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../../src/config';

export const findingsSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-findings',
    name: 'Fetch Findings',
    entities: [
      {
        resourceName: 'Finding',
        _type: 'microsoft_defender_finding',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_defender_machine_has_finding',
        sourceType: 'microsoft_defender_machine',
        _class: RelationshipClass.HAS,
        targetType: 'microsoft_defender_finding',
      },
    ],
    dependsOn: ['fetch-machines'],
    implemented: true,
  },
];
