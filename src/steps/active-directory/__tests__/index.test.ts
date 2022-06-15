// import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
// import {
//   entities,
//   TargetEntities,
//   fetchAccount,
//   fetchMachines,
//   buildMachineManagesDevicesRelationships,
//   fetchLogonUsers,
//   fetchFindings,
//   buildFindingIsCveRelationships,
// } from '..';
// import { IntegrationConfig } from '../../../../src/config';
// import { Recording, setupProjectRecording } from '../../../../test/recording';

// const config: IntegrationConfig = {
//   clientId: 'a8626c1e-191d-4e8f-9cbc-a4a6e85104ac',
//   clientSecret: 'L3X8Q~BO57QkoAsXMSkevrmVR2qiNh.qKEuzucAt',
//   tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
//   isDefenderApi: false,
// };

// const insufficientPermissionsDirectoryConfig: IntegrationConfig = {
//   clientId: 'clientId',
//   clientSecret: 'clientSecret',
//   tenant: '5a721b05-53ed-4ed9-be02-aed28f11edbd',
//   isDefenderApi: false,
// };
// // See test/README.md for details
// let recording: Recording;
// afterEach(async () => {
//   recording ? await recording.stop() : null;
// });

// describe('fetchAccount', () => {
//   it('Should create an account entity correctly when the account has the correct permissions', async () => {
//     const context = createMockStepExecutionContext({ instanceConfig: config });
//     await fetchAccount(context);

//     const accountEntities = context.jobState.collectedEntities;

//     expect(accountEntities.length).toBe(1);
//     expect(accountEntities).toMatchGraphObjectSchema({
//       _class: entities.ACCOUNT._class,
//     });
//     expect(accountEntities).toMatchSnapshot('accountEntitiesSuccessful');
//   });

//   it('Should error when there are errors attempting to get organization data', () => {
//     const context = createMockStepExecutionContext({
//       instanceConfig: insufficientPermissionsDirectoryConfig,
//     });
//     expect(fetchAccount(context)).rejects;
//   });
// });

// describe('fetchMachines', () => {
//   it('Should create an account entity correctly when the machine has the correct permissions', async () => {
//     recording = setupProjectRecording({
//       directory: __dirname,
//       name: 'fetchMachines',
//     });

//     const context = createMockStepExecutionContext({ instanceConfig: config });
//     await fetchMachines(context);

//     const machineEntities = context.jobState.collectedEntities;

//     expect(machineEntities.length).toBe(0);
//     expect(machineEntities).toMatchGraphObjectSchema({
//       _class: entities.MACHINE._class,
//     });
//     expect(machineEntities).toMatchSnapshot('machineEntitiesSuccessful');
//   });
// });

// describe('machineManagesDevicesRelationships', () => {
//   it('Should create an machine entity correctly when  machine manages devices relationships has the correct permissions', async () => {
//     const context = createMockStepExecutionContext({ instanceConfig: config });
//     await buildMachineManagesDevicesRelationships(context);

//     const machineDeviceEntities = context.jobState.collectedEntities;

//     expect(machineDeviceEntities.length).toBe(0);
//     expect(machineDeviceEntities).toMatchGraphObjectSchema({
//       _class: entities.MACHINE._class,
//     });
//     expect(machineDeviceEntities).toMatchSnapshot(
//       'machineDeviceEntitiesSuccessful',
//     );
//   });
// });

// describe('fetchLogonUsers', () => {
//   it('Should create an User entity correctly when log on User has the correct permissions', async () => {
//     recording = setupProjectRecording({
//       directory: __dirname,
//       name: 'fetchLogonUsers',
//     });

//     const context = createMockStepExecutionContext({ instanceConfig: config });
//     await fetchLogonUsers(context);
//     const logOnUserEntities = context.jobState.collectedEntities;
//     expect(logOnUserEntities.length).toBe(0);
//     expect(logOnUserEntities).toMatchGraphObjectSchema({
//       _class: entities.USER._class,
//     });
//     expect(logOnUserEntities).toMatchSnapshot('logOnUserEntitiesSuccessful');
//   });
// });

// describe('fetchFindings', () => {
//   it('Should create a Vulnerability finding entity correctly when user has the correct permissions', async () => {
//     recording = setupProjectRecording({
//       directory: __dirname,
//       name: 'fetchFindings',
//     });

//     const context = createMockStepExecutionContext({ instanceConfig: config });
//     await fetchFindings(context);

//     const vulnerabilityFindingEntities = context.jobState.collectedEntities;

//     expect(vulnerabilityFindingEntities.length).toBe(0);
//     expect(vulnerabilityFindingEntities).toMatchGraphObjectSchema({
//       _class: entities.FINDING._class,
//     });
//     expect(vulnerabilityFindingEntities).toMatchSnapshot(
//       'vulnerabilityFindingEntitiesSuccessful',
//     );
//   });
// });

// describe('CveRelationshipsFindings', () => {
//   it('Should create a Vulnerability finding entity correctly when there is a CVE relationship', async () => {
//     const context = createMockStepExecutionContext({ instanceConfig: config });
//     await buildFindingIsCveRelationships(context);

//     const cveFindingEntities = context.jobState.collectedEntities;

//     expect(cveFindingEntities.length).toBe(0);
//     expect(cveFindingEntities).toMatchGraphObjectSchema({
//       _class: TargetEntities.CVE._class,
//     });
//     expect(cveFindingEntities).toMatchSnapshot('cveFindingEntitiesSuccessful');
//   });
// });
