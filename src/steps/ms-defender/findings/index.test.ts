import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { Recording, setupProjectRecording } from '../../../../test/recording';
import { buildStepTestConfigForStep } from '../../../../test/config';
import { Steps } from '../../../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('#fetchFindings', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchFindings',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_FINDINGS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});

test('#buildFindingCveRelationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#buildFindingCveRelationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.FINDING_CVE_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchSnapshot();
});
