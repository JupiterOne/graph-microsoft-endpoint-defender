# Development

This Readme document provides details on how to leverage MS Defender Graph API
to access Microsoft defender data such as the Defender agent status,
Device\Machines data, Users, and associated vulnerabilities. Here we will
explore how to set up a Microsoft Azure account to access MS defender graph API.

## Prerequisites

- An Azure account with an App Registration that will provide credentials for
  the integration to authenticate with Microsoft Graph APIs. The App
  Registration also defines the permissions the integration requires and which
  the target tenant must authorize.
- An Active Directory tenant to target for ingestion. It is possible to target
  the Active Directory tenants defined in the Azure account holding the App
  Registration. Multi-tenant App Registrations that have not undergone
  [Publisher Verification][publisher-verification] cannot access other tenants.
- A Microsoft Defender for Endpoint account to create devices and run attacks
  via simulation technique. Can track vulnerabilities data, user groups creation
  and mapping users to devices.

A JupiterOne staff developer can provide credentials for an existing development
Azure account with an App Registration and tenants that tests are written
against. This is the easiest way to begin making changes to the integration.

Alternatively, you may establish a new Azure account, though tests will likely
need to be improved to avoid specific account information.

## App Registration

In Ms Defender portal:

1. [Create a Microsoft Defender for Endpoint account](https://www.microsoft.com/en-us/security/business/threat-protection/endpoint-defender)
2. [Set up the lab and add devices](#add-devices-and-simulations)

In the Azure portal:

1. Create a mulit-tenant App Registration
2. Configure the required [API permissions](#api-permissions)
3. Add a 2-year secret

## Add Devices and Simulations

To test the integration, we will need some test data, since we are working with
MS defender, an actual environment is needed. Such an environment will have an
Organization setup, Multiple Servers running a Defender agent on it, some users
associated with each machine (Server), and finally some vulnerabilities on some
of the machines. This kind of live environment setup will be very costly as well
as a tedious job, fortunately, Microsoft predicted that and provided an option
to create a testing Lab. You can use this Lab to create virtual test Machines,
users, Defender agents, and Vulnerabilities. This virtual environment will act
as a live environment and give you similar results when you hit any MS Defender
APIs. To create a Lab go to the
[Defender portal](https://security.microsoft.com/homepage), and navigate
to **Evaluations**.

1. Setup Lab

   1. Choose number of devices
   2. Accept terms and provide consent by checking the check box
   3. Setup lab

2. Add devices
   1. Available Tools
   2. Refresh the page to see the device status

It should be Status → Active and Simulator status → Completed . (It will take
some time to set up the device). After device setup is completed:

3. Go to Simulation tab and create simulation Select simulator → All Select
   simulation → SafeBreach: Credential Theft Select device → testmachine1
4. Click on create simulation

### API Permissions

Need to setup API permissions under two containers (one for
[azure account data](#microsoft-graph) and one for
[defender account data](#windowsdefenderatp))

#### Microsoft Graph

1. `Organization.Read.All`
   1. Read organization information
   2. Needed for creating the `Account` entity
2. `Directory.Read.All`
   1. Read directory data
   2. Needed for creating `User`, `Group`, and `GroupUser` entities

#### WindowsDefenderATP

1. `Machine.Read.All`
   1. Read machine information
   2. Needed for creating `Device` and `HostAgent` entities
2. `User.Read.All`
   1. Read user profiles
   2. Needed for creating `User` entities
3. `Vulnerability.Read.All`
   1. Read Threat and Vulnerability Management vulnerability information
   2. Needed for creating `Finding` entity

## Target Tenants

The integration is tested against three Active Directory tenants:

1. The app is installed, all permissions are granted
1. The app is installed, most permissions are insufficient
1. The app is not installed

This allows for ensuring the Microsoft Graph API code handles some common target
configuration scenarios.

You'll need a user account with global administrator access in each tenant.
[Grant admin consent](#authentication) to the multi-tenant application as
follows:

1. Default tenant: grant permission now and always grant new permissions as
   development of converters advances
2. "J1 Insufficient Permissions" tenant: grant permissions now
   (`Directory.Read.All` is all at this point in setup), but never grant any
   additional permisssions, to allow for testing cases where the app cannot
   fetch resources
3. "J1 Inaccessible" tenant: do not install the app at all here, to allow for
   testing cases where we have not been installed in a valid directory

Update `test/config.ts` with directory IDs as appropriate.

## Authentication

The flow will provide the tenant ID where consent has been granted, which is
stored for use in Microsoft Graph API calls.

Admin consent is granted to JupiterOne by:

1. Log in to JupiterOne as a user with permission to set up an integration
2. Add a Microsoft defender integration instance
3. You will be directed to Microsoft's identity platform, where you must login
   in as a global administrator of the Active Directory tenant you intend to
   target/ingest
4. Review the requested permissions and grant consent

Use this `tenant` ID and information from the App Registration to create an
`.env` file for local execution of the daemon/server application (this
repository):

```
CLIENT_ID='885121e7-c3c6-4378-8f6b-e315cc5994ce'
CLIENT_SECRET='<top secret passphrase>'
TENANT='<tenant / directory id>'
```

## References

How to set up permissions in the Azure console

- https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis
- https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-daemon-overview

How to add a client secret in the Azure console

- https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret

Sample Client Credentials Flow Project

- https://github.com/AzureAD/azure-activedirectory-library-for-nodejs/blob/master/sample/client-credentials-sample.js

SDK Links

- https://docs.microsoft.com/en-us/azure/developer/javascript/azure-sdk-library-package-index
- https://docs.microsoft.com/en-us/javascript/api/overview/azure/activedirectory?view=azure-node-latest

Client Credentials oAuth flow Overview

- https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#application-permissions

[msgraph-api]: https://docs.microsoft.com/en-us/graph/overview

#### APIs used for data ingestion :

To fetch machines :
https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machines?view=o365-worldwide

To fetch Logon users :
https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-machine-log-on-users?view=o365-worldwide

To fetch vulnerabilities :
https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/get-discovered-vulnerabilities?view=o365-worldwide
