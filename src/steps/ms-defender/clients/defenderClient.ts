import { Finding, Machine, UserLogon } from '../../../types';
import { GraphClient } from '../../../ms-graph/client';

export class DefenderClient extends GraphClient {
  BASE_URL_API: string = 'https://api.securitycenter.microsoft.com/api';
  constructor(logger, config) {
    super(logger, { ...config, isDefenderApi: true });
  }

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machines?view=o365-worldwide
  public async iterateMachines(
    callback: (user: Machine) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `${this.BASE_URL_API}/machines`,
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machine-log-on-users?view=o365-worldwide
  public async iterateUsers(
    input: {
      machineId: string;
      /**
       * The property names for `$select` query param.
       */
      select?: string | string[];
    },
    callback: (user: UserLogon) => void | Promise<void>,
  ): Promise<void> {
    const $select = input.select
      ? Array.isArray(input.select)
        ? input.select.join(',')
        : input.select
      : undefined;
    return this.iterateResources({
      resourceUrl: `${this.BASE_URL_API}/machines/${input.machineId}/logonusers`,
      query: $select ? { $select } : undefined,
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-discovered-vulnerabilities?view=o365-worldwide
  public async iterateFindings(
    input: {
      machineId: string;
      /**
       * The property names for `$select` query param.
       */
      select?: string | string[];
    },
    callback: (user: Finding) => void | Promise<void>,
  ): Promise<void> {
    let filters: any = [];
    if (process.env.FINDING_SEVERITY) {
      filters.push(
        '$filter=severity+eq+' +
          process.env.FINDING_SEVERITY?.split(',')
            .map((z) => "'" + z + "'")
            .join('+or+severity+eq+'),
      );
    }
    if (process.env.FINDING_LIMIT) {
      filters.push('$top=' + process.env.FINDING_LIMIT);
    }

    if (filters && filters.length) {
      filters = filters.join('&');
    }

    const url = `${this.BASE_URL_API}/machines/${input.machineId}/vulnerabilities?${filters}`;
    return this.iterateResources({
      resourceUrl: url,
      callback,
    });
  }
}
