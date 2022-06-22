import {
  IntegrationExecutionContext,
  IntegrationInstanceConfig,
  IntegrationStepExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { GraphClient } from './ms-graph/client';
import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  clientId: {
    type: 'string',
  },
  clientSecret: {
    type: 'string',
    mask: true,
  },
  tenant: {
    type: 'string',
  },
  findingSeverity: {
    type: 'string',
  },
  findingsLimit: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The Azure application client ID used to identify the program as the
   * registered app. This will be the same for all tenants since this is a
   * multi-tenant application.
   */
  clientId: string;

  /**
   * The Azuser App Registration client secret used to authenticate requests.
   */
  clientSecret: string;

  /**
   * The target directory/tenant ID, identified during the admin consent OAuth
   * flow.
   */
  tenant: string;
}

/**
 * An `IntegrationStepExecutionContext` typed for this integration's
 * `IntegrationInstanceConfig`.
 */
export type IntegrationStepContext =
  IntegrationStepExecutionContext<IntegrationConfig>;

export function validateExecutionConfig(
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
): void {
  const { clientId, clientSecret, tenant } = executionContext.instance.config;

  executionContext.logger.info(
    {
      clientId,
      tenantId: tenant,
    },
    'Configured to make Microsoft Graph API calls to tenantId acting as clientId',
  );

  if (!clientId || !clientSecret || !tenant) {
    throw new IntegrationValidationError(
      'Config requires all of {clientId, clientSecret, tenant}',
    );
  }
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  validateExecutionConfig(context);
  const apiClient = new GraphClient(context.logger, context.instance.config);
  await apiClient.verifyAuthentication();
}
