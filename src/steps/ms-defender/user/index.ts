import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DefenderClient } from '../clients/defenderClient';

import { entities, relationships, steps } from '../constants';
import { createUserEntity, createMachineUserRelationship } from './converters';

export * from '../constants';

/* To fetch users who logged into the machines and map them to machines */
export async function fetchLogonUsers(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DefenderClient(logger, instance.config);

  await jobState.iterateEntities(
    { _type: entities.MACHINE._type },
    async (machineEntity) => {
      await graphClient.iterateUsers(
        { machineId: machineEntity.id as string },
        async (user) => {
          const userEntity = createUserEntity(user);
          await jobState.addEntity(userEntity);
          await jobState.addRelationship(
            createMachineUserRelationship(machineEntity, userEntity),
          );
        },
      );
    },
  );
}
export const userSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_USERS,
    name: 'Ms defender machine logged in Users',
    entities: [entities.USER],
    relationships: [
      relationships.ACCOUNT_HAS_MACHINE,
      relationships.MACHINE_HAS_USER,
    ],
    dependsOn: [steps.FETCH_MACHINE],
    executionHandler: fetchLogonUsers,
  },
];
