import { machineSpec } from './machine';
import { vulnerabilitiesSpec } from './vulnerabilities';
import { logonUserSpec } from './logon-user';

export const msDefenderSpec = [
  ...machineSpec,
  ...vulnerabilitiesSpec,
  ...logonUserSpec,
];
