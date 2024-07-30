import { Vulnerability, Machine, UserLogon } from '../../types';
import { GraphClient, GraphClientResponse } from '../../ms-graph/client';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import { ClientConfig } from '../../ms-graph/types';

const ITEMS_PER_PAGE = 500;
export class DefenderClient extends GraphClient {
  constructor(logger: IntegrationLogger, config: ClientConfig) {
    super(logger, { ...config, isDefenderApi: true });
  }
  BASE_URL_API: string = 'https://api.securitycenter.microsoft.com/api';

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machines?view=o365-worldwide
  public async iterateMachines(
    callback: (machine: Machine) => void | Promise<void>,
    limit?: number,
  ): Promise<void> {
    return this.iterateSecurityResource({
      resourceUrl: `${this.BASE_URL_API}/machines`,
      callback,
      limit: limit ?? ITEMS_PER_PAGE,
    });
  }

  /**
   * Retrieves a collection of logged on users on a specific machine.
   * For a given device, a user is only returned one. Across multiple
   * machines, the same user is returned multiple times.
   * https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machine-log-on-users?view=o365-worldwide
   */
  public async iterateLogonUsers(
    input: {
      machineId: string;
    },
    callback: (logonUser: UserLogon) => void | Promise<void>,
    limit?: number,
  ): Promise<void> {
    return this.iterateSecurityResource({
      resourceUrl: `${this.BASE_URL_API}/machines/${input.machineId}/logonusers`,
      callback,
      limit: limit ?? ITEMS_PER_PAGE,
    });
  }

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-discovered-vulnerabilities?view=o365-worldwide
  public async iterateVulnerabilities(
    input: {
      machineId: string;
    },
    callback: (vulnerability: Vulnerability) => void | Promise<void>,
    limit?: number,
  ): Promise<void> {
    const url = `${this.BASE_URL_API}/machines/${input.machineId}/vulnerabilities?`;
    return this.iterateSecurityResource({
      resourceUrl: url,
      callback,
      limit: limit ?? ITEMS_PER_PAGE,
    });
  }

  // https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machine-by-id?view=o365-worldwide
  public async fetchEndpointDetails(machineId: string): Promise<any> {
    return this.callApiWithRetry({
      link: `${this.BASE_URL_API}/machines/${machineId}?`,
    });
  }

  private async iterateSecurityResource<T>({
    resourceUrl,
    callback,
    limit = ITEMS_PER_PAGE,
  }: {
    resourceUrl: string;
    callback: (item: T) => void | Promise<void>;
    limit?: number;
  }): Promise<void> {
    let retries = 0;
    let response: GraphClientResponse<T> | undefined;
    let skip = 0;
    let objectsSeen = 0;
    do {
      try {
        response = await this.callApiWithRetry<T>({
          link: resourceUrl,
          query: { $top: limit, $skip: skip },
        });
      } catch (err) {
        if (
          err.message ===
            'CompactToken parsing failed with error code: 80049217' &&
          retries < 5
        ) {
          // Retry a few times to handle sporadic timing issue with this sdk - https://github.com/OneDrive/onedrive-api-docs/issues/785
          retries++;
          continue;
        } else {
          this.handleApiError(err, resourceUrl);
          break;
        }
      }

      if (response) {
        for (const value of response.value) {
          await callback(value);
        }
        objectsSeen += response.value.length;
      }
      skip += limit;
    } while (skip == objectsSeen);
  }
}
