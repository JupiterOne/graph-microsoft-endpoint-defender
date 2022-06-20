import { deviceSteps } from './device';
import { findingSteps } from './finding';
import { userSteps } from './user';

export const msDefenderSteps = [...deviceSteps, ...findingSteps, ...userSteps];
