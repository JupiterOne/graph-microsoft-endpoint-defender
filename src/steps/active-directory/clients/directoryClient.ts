import { Finding, Machine, UserLogon } from '../../../model';
import { GraphClient } from '../../../ms-graph/client';

export enum MemberType {
  USER = '#microsoft.graph.user',
}


export class DirectoryGraphClient extends GraphClient {

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machines?view=o365-worldwide
  public async iterateMachines(
    callback: (user: Machine) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({ resourceUrl: `${process.env.BASE_URL_API}/machines`, callback });
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
    return this.iterateResources({ resourceUrl: `${process.env.BASE_URL_API}/machines/${input.machineId}/logonusers`,  query: $select ? { $select } : undefined,callback });
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
    const $select = input.select
      ? Array.isArray(input.select)
        ? input.select.join(',')
        : input.select
      : undefined;

    return this.iterateResources({
      resourceUrl: `${process.env.BASE_URL_API}/machines/${input.machineId}/vulnerabilities?$top=${process.env.FINDIGS_LIMIT}&$filter=severity+eq+'${process.env.FINDING_SEVERITY}'`,
      query: $select ? { $select } : undefined,
      callback,
    });
  }
}
