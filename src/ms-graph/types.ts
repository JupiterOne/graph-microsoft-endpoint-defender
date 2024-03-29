/**
 * Properties required to configure the Microsoft Graph client authentication
 * and target directory/tenant.
 */
export type ClientConfig = {
  /**
   * The application client ID. This is the value provided by the App
   * Registration.
   */
  clientId: string;

  /**
   * The application client secret. The value is maintained as part of the App
   * Registration.
   */
  clientSecret: string;

  /**
   * The Active Directory ID (Tenant) to target in requests to Microsoft Graph.
   */
  tenant: string;

  /**
   * The flag to required to check if its a defender api or azure api which is required
   * to set scope for api calls
   */
  isDefenderApi?: boolean | undefined;
};
