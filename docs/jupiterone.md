# Microsoft Defender for Endpoint Integration with JupiterOne

## Microsoft Defender for Endpoint + JupiterOne Integration Benefits

- Visualize Microsoft Defender for Endpoint resources in the JupiterOne graph.
- Map Microsoft Defender for Endpoint users to employees in your JupiterOne
  account.
- Monitor changes to Microsoft Defender for Endpoint users using JupiterOne
  alerts.

## How it Works

- JupiterOne periodically fetches resources from Microsoft Defender for Endpoint
  to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Requirements

- An Azure account with an App Registration that will provide credentials for
  the integration to authenticate with Microsoft Graph APIs. The App
  Registration also defines the permissions the integration requires and which
  the target tenant must authorize.
- An Active Directory tenant to target for ingestion. It is possible to target
  the Active Directory tenants defined in the Azure account holding the App
  Registration.
- A Microsoft Defender for Endpoint account to create devices and run attacks
  via simulation technique. Can track vulnerabilities data, user groups creation
  and mapping users to devices.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In Microsoft Defender for Endpoint

1. [Create a Microsoft Defender for Endpoint account](https://www.microsoft.com/en-us/security/business/threat-protection/endpoint-defender)
2. Add devices

In the Azure portal:

1. Create an App Registration
2. Configure the required [API permissions](#api-permissions)
3. Add a 2-year secret

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Microsoft Defender for Endpoint** integration tile and click
   it.
3. Click the **Add Configuration** button and configure the following settings:

- Enter the **Account Name** by which you'd like to identify this Microsoft
  Defender for Endpoint account in JupiterOne. Ingested entities will have this
  value stored in `tag.AccountName` when **Tag with Account Name** is checked.
- Enter a **Description** that will further assist your team when identifying
  the integration instance.
- Select a **Polling Interval** that you feel is sufficient for your monitoring
  needs. You may leave this as `DISABLED` and manually execute the integration.
- Enter the **Client ID**, **Client Secret**, and **Tenant** generated for use
  by JupiterOne.

4. Click **Create Configuration** once all values are provided.

## API Permissions

Need to setup API permissions under two containers (one for
[azure account data](#microsoft-graph) and one for
[defender account data](#windowsdefenderatp))

### Microsoft Graph

1. `Organization.Read.All`
   1. Read organization information
   2. Needed for creating the `Account` entity
2. `Directory.Read.All`
   1. Read directory data
   2. Needed for creating `User`, `Group`, and `GroupUser` entities

### WindowsDefenderATP

1. `Machine.Read.All`
   1. Read machine information
   2. Needed for creating `Device` and `HostAgent` entities
2. `User.Read.All`
   1. Read user profiles
   2. Needed for creating `User` entities
3. `Vulnerability.Read.All`
   1. Read Threat and Vulnerability Management vulnerability information
   2. Needed for creating `Vulnerability` entity

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Microsoft Defender for Endpoint** integration tile and click
   it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources           | Entity `_type`                     | Entity `_class` |
| ------------------- | ---------------------------------- | --------------- |
| Account             | `microsoft_defender_account`       | `Account`       |
| Device/Machine/Host | `user_endpoint`                    | `Device`        |
| Logon User          | `microsoft_defender_logon_user`    | `User`          |
| Machine             | `microsoft_defender_machine`       | `HostAgent`     |
| User                | `microsoft_defender_user`          | `User`          |
| Vulnerability       | `microsoft_defender_vulnerability` | `Finding`       |

### Relationships

The following relationships are created:

| Source Entity `_type`        | Relationship `_class` | Target Entity `_type`              |
| ---------------------------- | --------------------- | ---------------------------------- |
| `microsoft_defender_account` | **HAS**               | `microsoft_defender_machine`       |
| `microsoft_defender_account` | **HAS**               | `microsoft_defender_user`          |
| `microsoft_defender_machine` | **HAS**               | `microsoft_defender_logon_user`    |
| `microsoft_defender_machine` | **IDENTIFIED**        | `microsoft_defender_vulnerability` |
| `microsoft_defender_machine` | **MANAGES**           | `user_endpoint`                    |

### Mapped Relationships

The following mapped relationships are created:

| Source Entity `_type`              | Relationship `_class` | Target Entity `_type` | Direction |
| ---------------------------------- | --------------------- | --------------------- | --------- |
| `microsoft_defender_vulnerability` | **IS**                | `*cve*`               | FORWARD   |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
