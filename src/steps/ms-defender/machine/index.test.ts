import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { Steps } from '../../../constants';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { buildStepTestConfigForStep } from '../../../../test/config';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('#fetchMachines', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchMachines',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_MACHINES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});

test('#fetchEndpoints', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchEndpoints',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_ENDPOINTS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});
