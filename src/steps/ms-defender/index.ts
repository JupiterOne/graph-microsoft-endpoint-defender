import { machineSteps } from './machine';
import { vulnerabilitiesSteps } from './vulnerabilities';
import { logonUserSteps } from './logon-user';

export const msDefenderSteps = [
  ...machineSteps,
  ...vulnerabilitiesSteps,
  ...logonUserSteps,
];
