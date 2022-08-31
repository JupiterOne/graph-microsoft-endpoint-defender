import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('#fetchAccount', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchAccount',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_ACCOUNT.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});

test('#fetchUsers', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchUsers',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_USERS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});
