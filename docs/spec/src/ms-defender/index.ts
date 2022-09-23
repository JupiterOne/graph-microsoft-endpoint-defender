import { machineSpec } from './machine';
import { findingsSpec } from './findings';
import { logonUserSpec } from './logon-user';

export const msDefenderSpec = [
  ...machineSpec,
  ...findingsSpec,
  ...logonUserSpec,
];
