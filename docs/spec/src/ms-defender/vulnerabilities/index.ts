import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../../../src/config';

export const vulnerabilitiesSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-vulnerabilities',
    name: 'Fetch Vulnerabilities',
    entities: [
      {
        resourceName: 'Vulnerability',
        _type: 'microsoft_defender_vulnerability',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_defender_machine_identified_vulnerability',
        sourceType: 'microsoft_defender_machine',
        _class: RelationshipClass.IDENTIFIED,
        targetType: 'microsoft_defender_vulnerability',
      },
    ],
    dependsOn: ['fetch-machines'],
    implemented: true,
  },
];
