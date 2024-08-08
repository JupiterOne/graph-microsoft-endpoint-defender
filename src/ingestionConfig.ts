import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { INGESTION_SOURCE_IDS } from './constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [INGESTION_SOURCE_IDS.USERS]: {
    title: 'Users',
    description: 'Fetch User data',
  },
  [INGESTION_SOURCE_IDS.MACHINES]: {
    title: 'Machines',
    description: 'Fetch information about machines and endpoints',
  },
  [INGESTION_SOURCE_IDS.LOGON_USERS]: {
    title: 'Logon Users',
    description:
      'Gather a collection of logged on users on a specific device and links it to existing data',
  },
  [INGESTION_SOURCE_IDS.VULNERABILITIES]: {
    title: 'Vulnerabilities',
    description:
      'Retrieves a collection of discovered vulnerabilities and relates it to existing machines',
  },
};
