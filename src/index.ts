import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { activeDirectorySteps } from './steps/active-directory';
import { IntegrationConfig } from './types';
import { instanceConfigFields, validateInvocation } from './config';

export const integrationSteps = [...activeDirectorySteps];

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps,
  };
