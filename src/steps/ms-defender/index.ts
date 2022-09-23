import { machineSteps } from './machine';
import { findingsSteps } from './findings';
import { logonUserSteps } from './logon-user';

export const msDefenderSteps = [
  ...machineSteps,
  ...findingsSteps,
  ...logonUserSteps,
];
