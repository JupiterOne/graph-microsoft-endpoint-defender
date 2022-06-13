import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { entities, fetchAccount } from '..';
import { integrationConfig } from '../../../../test/config';

import {
  createAccountEntityWithOrganization,
  createAccountMachineRelationship,
  createMachineUserRelationship,
  createMachineEntity,
  createUserEntity,
  createMachineFindingsRelationship,
  createFindingEntity,
  createFindingsCveRelationship,
  createMachinesDeviceRelationship,
} from '../converters';
// describe('fetchAccount', () => {
//   it('Should create an account entity correctly when the account has the correct permissions', async () => {
//     const context = createMockStepExecutionContext({ instanceConfig: integrationConfig });

//     await fetchAccount(context);

//     const accountEntities = context.jobState.collectedEntities;

//     expect(accountEntities.length).toBe(1);
//     expect(accountEntities).toMatchGraphObjectSchema({
//       _class: entities.ACCOUNT._class,
//     });
//     expect(accountEntities).toMatchSnapshot('accountEntitiesSuccessful');
//   });

//   // it('Should error when there are errors attempting to get organization data', () => {

//   //   const context = createMockStepExecutionContext({
//   //     instanceConfig: insufficientPermissionsDirectoryConfig,
//   //   });
//   //   expect(fetchAccount(context)).rejects;
//   // });

//   // it('Should not error and create a real account when there is no mdm authority', async () => {
//   //   recording = setupAzureRecording({
//   //     directory: __dirname,
//   //     name: 'fetchAccountNoMdm',
//   //     options: {
//   //       recordFailedRequests: true, // getting the intune subscription will fail
//   //       matchRequestsBy: {
//   //         order: false,
//   //       },
//   //     },
//   //   });
//   //   const context = createMockStepExecutionContext({
//   //     instanceConfig: noMdmConfig,
//   //   });

//   //   await fetchAccount(context);

//   //   const accountEntities = context.jobState.collectedEntities;

//   //   expect(accountEntities.length).toBe(1);
//   //   expect(accountEntities).toMatchGraphObjectSchema({
//   //     _class: entities.ACCOUNT._class,
//   //   });
//   //   expect(accountEntities).toMatchSnapshot('accountEntitiesNoMdm');
//   // });
// });
