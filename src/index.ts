import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { activeDirectorySteps } from './steps/active-directory';
import {
  instanceConfigFields,
  IntegrationConfig,
  validateInvocation,
} from './config';
import { msDefenderSteps } from './steps/ms-defender';
import { ingestionConfig } from './ingestionConfig';

export const integrationSteps = [...activeDirectorySteps, ...msDefenderSteps];

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps,
    ingestionConfig,
  };
