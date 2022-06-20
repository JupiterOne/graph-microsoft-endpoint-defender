import { Finding, Machine, UserLogon } from '../../../types';
import { GraphClient } from '../../../ms-graph/client';

export enum MemberType {
  USER = '#microsoft.graph.user',
}

export class DirectoryGraphClient extends GraphClient {
  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machines?view=o365-worldwide
  public async iterateMachines(
    callback: (user: Machine) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `${process.env.BASE_URL_API}/machines`,
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
      resourceUrl: `${process.env.BASE_URL_API}/machines/${input.machineId}/logonusers`,
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
    if (process.env.FINDIGS_LIMIT) {
      filters.push('$top=' + process.env.FINDIGS_LIMIT);
    }

    if (filters && filters.length) {
      filters = filters.join('&');
    }

    const url = `${process.env.BASE_URL_API}/machines/${input.machineId}/vulnerabilities?${filters}`;
    return this.iterateResources({
      resourceUrl: url,
      callback,
    });
  }
}
