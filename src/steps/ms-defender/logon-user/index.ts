import {
  getRawData,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../config';
import { DefenderClient } from '../client';
import { Entities, INGESTION_SOURCE_IDS, Relationships, Steps } from '../../../constants';
import {
  createLogonUserEntity,
  createLogonUserEntityKey,
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

      await graphClient.iterateLogonUsers(
        { machineId: machine.id },
        async (logonUser) => {
          const logonUserEntityKey = createLogonUserEntityKey(logonUser);

          if (jobState.hasKey(logonUserEntityKey)) return;

          const logonUserEntity = await jobState.addEntity(
            createLogonUserEntity(logonUser),
          );

          const machineLogonUserRelationship =
            createMachineLogonUserRelationship({
              machineEntity,
              logonUserEntity,
            });
          if (!jobState.hasKey(machineLogonUserRelationship._key)) {
            await jobState.addRelationship(machineLogonUserRelationship);
          }
        },
      );
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
    ingestionSourceId: INGESTION_SOURCE_IDS.LOGON_USERS,
    executionHandler: fetchLogonUsers,
  },
];
