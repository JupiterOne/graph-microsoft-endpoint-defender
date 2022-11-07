import { Vulnerability, Machine, UserLogon } from '../../types';
import { GraphClient } from '../../ms-graph/client';

export class DefenderClient extends GraphClient {
  constructor(logger, config) {
    super(logger, { ...config, isDefenderApi: true });
  }
  BASE_URL_API: string = 'https://api.securitycenter.microsoft.com/api';

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machines?view=o365-worldwide
  public async iterateMachines(
    callback: (machine: Machine) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `${this.BASE_URL_API}/machines`,
      callback,
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
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `${this.BASE_URL_API}/machines/${input.machineId}/logonusers`,
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-discovered-vulnerabilities?view=o365-worldwide
  public async iterateVulnerabilities(
    input: {
      machineId: string;
    },
    callback: (vulnerability: Vulnerability) => void | Promise<void>,
  ): Promise<void> {
    const url = `${this.BASE_URL_API}/machines/${input.machineId}/vulnerabilities?`;
    return this.iterateResources({
      resourceUrl: url,
      callback,
    });
  }

  // https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machine-by-id?view=o365-worldwide
  public async fetchEndpointDetails(machineId: string): Promise<any> {
    return this.callApiWithRetry({
      link: `${this.BASE_URL_API}/machines/${machineId}?`,
    });
  }
}
