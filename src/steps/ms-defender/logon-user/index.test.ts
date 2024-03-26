import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { Steps } from '../../../constants';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { buildStepTestConfigForStep } from '../../../../test/config';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test.skip('#fetchLogonUsers', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchLogonUsers',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_LOGON_USERS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});
