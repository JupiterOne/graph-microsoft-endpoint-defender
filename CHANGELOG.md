# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

The following entities are created:

| Resources  | Entity `_type`                  | Entity `_class` |
| ---------- | ------------------------------- | --------------- |
| Account    | `microsoft_defender_account`    | `Account`       |
| Finding    | `microsoft_defender_finding`    | `Finding`       |
| Logon User | `microsoft_defender_logon_user` | `User`          |
| Machine    | `microsoft_defender_machine`    | `Device`        |
| User       | `microsoft_defender_user`       | `User`          |

The following relationships are created:

| Source Entity `_type`        | Relationship `_class` | Target Entity `_type`           |
| ---------------------------- | --------------------- | ------------------------------- |
| `microsoft_defender_account` | **HAS**               | `microsoft_defender_machine`    |
| `microsoft_defender_account` | **HAS**               | `microsoft_defender_user`       |
| `microsoft_defender_machine` | **HAS**               | `microsoft_defender_finding`    |
| `microsoft_defender_machine` | **HAS**               | `microsoft_defender_logon_user` |

The following mapped relationships are created:

| Source Entity `_type`        | Relationship `_class` | Target Entity `_type` | Direction |
| ---------------------------- | --------------------- | --------------------- | --------- |
| `microsoft_defender_finding` | **IS**                | `*cve*`               | FORWARD   |
