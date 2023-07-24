# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.4.2 - 2023-07-23

### Changed

- `name` on to microsoft_defender_machine and user_endpoint entities to default
  to a name that includes the `managedBy` property if one is not provided.

## 1.3.1 - 2023-06-20

## 1.3.0 - 2023-06-20

### Added

- `lastSeenOn` to HostAgent entities.
- `ipAddress` and `macAddress` to Device entities.

### Changed

- `make`, `model`, `serial`, and `deviceId` on Device entities from "unknown" to
  null.

## 1.1.0 - 2023-04-27

### Changed

Added support for macAddress, ipAddress and several other entitiy properties
macAddress format parsing for consistency ipAddress filtering for localhost NICs

## 1.0.7 - 2023-01-31

### Changed

Catching and combining machine endpoint API errors into a final single thrown
error at the end of the step.

## 1.0.6 - 2023-01-30

### Changed

Now allowing 404 errors to be retried.

## 1.0.5 - 2022-11-11

## Fixed

Fixed retry logic for 429s.

## 1.0.4 - 2022-11-07

Improved retry logic for 429s. Removed duplicate key detection logic and change
the Logon User entity key to guarantee uniqueness.

## 1.0.3 - 2022-11-03

### Updated

Introduced retry logic in the Microsoft GraphClient. Added duplicate key
detection logic for the logon-user entity with logging.

## 1.0.0 - 2022-09-26

### Added

The following entities are created:

| Resources           | Entity `_type`                     | Entity `_class` |
| ------------------- | ---------------------------------- | --------------- |
| Account             | `microsoft_defender_account`       | `Account`       |
| Device/Machine/Host | `user_endpoint`                    | `Device`        |
| Vulnerability       | `microsoft_defender_vulnerability` | `Finding`       |
| Logon User          | `microsoft_defender_logon_user`    | `User`          |
| Machine             | `microsoft_defender_machine`       | `HostAgent`     |
| User                | `microsoft_defender_user`          | `User`          |

The following relationships are created:

| Source Entity `_type`        | Relationship `_class` | Target Entity `_type`              |
| ---------------------------- | --------------------- | ---------------------------------- |
| `microsoft_defender_account` | **HAS**               | `microsoft_defender_machine`       |
| `microsoft_defender_account` | **HAS**               | `microsoft_defender_user`          |
| `microsoft_defender_machine` | **HAS**               | `microsoft_defender_logon_user`    |
| `microsoft_defender_machine` | **IDENTIFIED**        | `microsoft_defender_vulnerability` |
| `microsoft_defender_machine` | **MANAGES**           | `user_endpoint`                    |

The following mapped relationships are created:

| Source Entity `_type`              | Relationship `_class` | Target Entity `_type` | Direction |
| ---------------------------------- | --------------------- | --------------------- | --------- |
| `microsoft_defender_vulnerability` | **IS**                | `*cve*`               | FORWARD   |
