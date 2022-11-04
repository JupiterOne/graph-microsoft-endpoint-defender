import {
  getRawData,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DefenderClient } from '../client';
import { Entities, Relationships, Steps } from '../../../constants';
import {
  createLogonUserEntity,
  createMachineLogonUserRelationship,
} from './converters';
import { Machine } from '../../../types';

export async function fetchLogonUsers({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DefenderClient(logger, instance.config);

  await jobState.iterateEntities(
    { _type: Entities.MACHINE._type },
    async (machineEntity) => {
      const machine = getRawData<Machine>(machineEntity);
      if (!machine) {
        logger.warn(
          { _key: machineEntity._key },
          'Could not get raw data for machine entity',
        );
        return;
      }

      const userByMachine = {};

      await graphClient.iterateLogonUsers(
        { machineId: machine.id },
        async (logonUser) => {
          const entity = createLogonUserEntity(logonUser);

          // Are these duplicates on a single machine?
          userByMachine[machine.id] = [
            ...(userByMachine[machine.id] ?? []),
            entity._key,
          ];

          if (!jobState.hasKey(entity._key)) {
            const logonUserEntity = await jobState.addEntity(entity);

            await jobState.addRelationship(
              createMachineLogonUserRelationship({
                machineEntity,
                logonUserEntity,
              }),
            );
          } else {
            const orgEntity = (await jobState.findEntity(entity._key))!;

            logger.warn(
              {
                dupProperties: {
                  duplicateKey: entity._key,
                  machineId: machine.id,
                  id: entity.id === orgEntity.id,
                  name: entity.name === orgEntity.name,
                  domain: entity.domain === orgEntity.domain,
                  username: entity.username === orgEntity.username,
                  displayName: entity.displayName === orgEntity.displayName,
                  logonTypes: entity.logonTypes === orgEntity.logonTypes,
                  firstSeenOn: entity.firstSeenOn === orgEntity.firstSeenOn,
                  lastSeenOn: entity.lastSeenOn === orgEntity.lastSeenOn,
                  active: entity.active === orgEntity.active,
                },
              },
              `Found duplicate logon user entity. Skipping creation.`,
            );
          }
        },
      );

      logger.warn({ userByMachine }, 'User logons by machine.');
    },
  );
}

export const logonUserSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: Steps.FETCH_LOGON_USERS.id,
    name: Steps.FETCH_LOGON_USERS.name,
    entities: [Entities.LOGON_USER],
    relationships: [Relationships.MACHINE_HAS_LOGON_USER],
    dependsOn: [Steps.FETCH_MACHINES.id],
    executionHandler: fetchLogonUsers,
  },
];
