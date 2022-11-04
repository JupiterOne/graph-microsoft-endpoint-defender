import { AccessToken, ClientSecretCredential } from '@azure/identity';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
} from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

import { ClientConfig } from './types';
import { retry } from '@lifeomic/attempt';

export type QueryParams = string | { [key: string]: string | number };

interface GraphClientResponse<T> {
  value: T[];
  '@odata.nextLink'?: string;
}

/**
 * Pagination: https://docs.microsoft.com/en-us/graph/paging
 * Throttling with retry after: https://docs.microsoft.com/en-us/graph/throttling
 * Batching requests: https://docs.microsoft.com/en-us/graph/json-batching
 */
export class GraphClient {
  private readonly TIMEOUT_RETRY_ATTEMPTS = 3;
  protected client: Client;

  constructor(
    readonly logger: IntegrationLogger,
    readonly config: ClientConfig,
  ) {
    this.client = Client.initWithMiddleware({
      authProvider: new GraphAuthenticationProvider(config),
    });
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.client.api('/organization').get();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/organization',
        status: err.statusCode,
        statusText: err.code,
      });
    }
  }

  /**
   * Fetch organization details. Throws an error when this cannot be
   * accomplished.
   */
  public async fetchResource<T>(url: string): Promise<T> {
    try {
      const response = await this.client.api(url).get();
      return response.value[0];
    } catch (err) {
      this.handleApiError(err, url);
      const errorOptions = {
        cause: err,
        endpoint: url,
        status: err.statusCode,
        statusText: err.code,
      };
      if (err.statusCode === 401) {
        throw new IntegrationProviderAuthorizationError(errorOptions);
      } else {
        throw new IntegrationProviderAPIError(errorOptions);
      }
    }
  }

  // Not using PageIterator because it doesn't allow async callback
  /**
   * Iterate resources. 401 Unauthorized, 403 Forbidden, and 404 Not Found
   * responses are considered empty collections. Other API errors will be
   * thrown.
   */
  protected async iterateResources<T>({
    resourceUrl,
    query,
    callback,
  }: {
    resourceUrl: string;
    query?: QueryParams;
    callback: (item: T) => void | Promise<void>;
  }): Promise<void> {
    let nextLink: string | undefined = resourceUrl;
    let retries = 0;
    let response: GraphClientResponse<T> | undefined;
    do {
      try {
        response = await this.callApiWithRetry<T>({
          link: nextLink,
          query,
        });
      } catch (err) {
        if (
          err.message ===
            'CompactToken parsing failed with error code: 80049217' &&
          nextLink &&
          retries < 5
        ) {
          // Retry a few times to handle sporatic timing issue with this sdk - https://github.com/OneDrive/onedrive-api-docs/issues/785
          retries++;
          continue;
        } else {
          nextLink = undefined;
          this.handleApiError(err, resourceUrl);
        }
      }
      if (response) {
        for (const value of response.value) {
          await callback(value);
        }
        nextLink = response['@odata.nextLink'];
      } else {
        nextLink = undefined;
      }
    } while (nextLink);
  }

  /**
   * Wraps callApi with retry logic.
   * @param link
   * @param query
   * @param timeoutRetryAttempt
   * @protected
   */
  protected async callApiWithRetry<T>(
    {
      link,
      query,
    }: {
      link: string;
      query?: QueryParams;
    },
    timeoutRetryAttempt = 0,
  ): Promise<GraphClientResponse<T> | undefined> {
    return retry(() => this.callApi<T>({ link, query }), {
      maxAttempts: 3,
      delay: 30_000,
      timeout: 360_000,
      factor: 2,
      handleError: (error, attemptContext) => {
        if ([404, 403, 401].includes(error.statusCode)) {
          attemptContext.abort();
        }

        this.logger.info(
          { error, attemptContext, link },
          `Encountered an error.`,
        );
      },
      handleTimeout: async (attemptContext) => {
        if (timeoutRetryAttempt < this.TIMEOUT_RETRY_ATTEMPTS) {
          this.logger.warn(
            {
              attemptContext,
              timeoutRetryAttempt,
              link,
            },
            'Hit a timeout, restarting request retry cycle.',
          );

          return this.callApiWithRetry(
            {
              link,
              query,
            },
            ++timeoutRetryAttempt,
          );
        } else {
          this.logger.warn(
            {
              attemptContext,
              timeoutRetryAttempt,
              link,
            },
            'Hit a timeout during the final attempt. Unable to collect data for this query.',
          );
        }
      },
    });
  }

  protected async callApi<T>({
    link,
    query,
  }: {
    link: string;
    query?: QueryParams;
  }): Promise<GraphClientResponse<T> | undefined> {
    let api = this.client.api(link);
    if (query) {
      api = api.query(query);
    }

    const response = await api.get();
    if (response) {
      return response;
    }
  }

  public handleApiError(err: any, resourceUrl: string) {
    const errorOptions = {
      cause: err,
      endpoint: resourceUrl,
      status: err.statusCode,
      statusText: err.statusText || err.code || err.message,
    };
    // Skip errors caused by the account not being configured for the content being ingested
    if (err.message.startsWith('Request not applicable to target tenant')) {
      this.logger.info(err);
    } else if (err.statusCode === 401) {
      this.logger.info({ resourceUrl }, 'Unauthorized');
    } else if (err.statusCode === 403) {
      this.logger.info({ resourceUrl }, 'Forbidden');
    } else if (err.statusCode !== 404) {
      throw new IntegrationProviderAPIError(errorOptions);
    }
  }
}

class GraphAuthenticationProvider implements AuthenticationProvider {
  private accessToken: AccessToken | null;

  constructor(readonly config: ClientConfig) {}

  /**
   * Obtains an accessToken (in case of success) or rejects with error (in case
   * of failure). Refreshes token when it is approaching expiration.
   */
  public async getAccessToken(
    options?: AuthenticationProviderOptions,
  ): Promise<string> {
    if (
      !this.accessToken ||
      this.accessToken.expiresOnTimestamp - Date.now() < 1000 * 60
    ) {
      const credentials = new ClientSecretCredential(
        this.config.tenant,
        this.config.clientId,
        this.config.clientSecret,
      );
      options = {
        scopes: this.config.isDefenderApi
          ? [
              'https://securitycenter.onmicrosoft.com/windowsatpservice/.default',
            ]
          : undefined,
      };
      const scopes = options?.scopes || 'https://graph.microsoft.com/.default';
      this.accessToken = await credentials.getToken(scopes);
    }
    if (!this.accessToken) {
      throw new Error(
        'Authentication cannot be peformed at this time, no reason provided by Microsoft identity platform.',
      );
    } else {
      return this.accessToken.token;
    }
  }
}
