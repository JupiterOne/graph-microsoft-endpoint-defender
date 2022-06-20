import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { activeDirectorySteps } from './steps/active-directory';
import { msDefenderSteps } from './steps/ms-defender-steps';
import {
  instanceConfigFields,
  IntegrationConfig,
  validateInvocation,
} from './config';

export const integrationSteps = [...activeDirectorySteps];

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps,
  };
