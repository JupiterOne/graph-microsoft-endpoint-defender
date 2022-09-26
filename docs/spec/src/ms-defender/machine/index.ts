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
        _class: ['HostAgent'],
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
  {
    id: 'fetch-endpoints',
    name: 'Fetch Endpoints',
    entities: [
      {
        resourceName: 'Device/Machine/Host',
        _type: 'user_endpoint',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'microsoft_defender_machine_manages_user_endpoint',
        sourceType: 'microsoft_defender_machine',
        _class: RelationshipClass.MANAGES,
        targetType: 'user_endpoint',
      },
    ],
    dependsOn: ['fetch-machines'],
    implemented: true,
  },
];
