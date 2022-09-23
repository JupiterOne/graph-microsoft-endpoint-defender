import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { activeDirectorySpec } from './active-directory';
import { msDefenderSpec } from './ms-defender';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...msDefenderSpec, ...activeDirectorySpec],
};
