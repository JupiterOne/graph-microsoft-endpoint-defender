import { Organization, User } from '@microsoft/microsoft-graph-types';
import { GraphClient } from '../../ms-graph/client';

export class ActiveDirectoryClient extends GraphClient {
  /**
   * Fetch organization details
   */
  public async fetchOrganization(): Promise<Organization> {
    return this.fetchResource<Organization>('/organization');
  }

  /**
   * Fetch organization users
   */
  public async iterateUsers(
    callback: (user: User) => void | Promise<void>,
  ): Promise<void> {
    const resourceUrl = '/users';
    this.logger.info('Iterating users.');
    const defaultSelect = [
      'businessPhones',
      'displayName',
      'givenName',
      'jobTitle',
      'mail',
      'mobilePhone',
      'officeLocation',
      'preferredLanguage',
      'surname',
      'userPrincipalName',
      'id',
      'userType',
      'accountEnabled',
    ];
    return this.iterateResources({
      resourceUrl,
      query: defaultSelect.join(','),
      callback,
    });
  }
}
