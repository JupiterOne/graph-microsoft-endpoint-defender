import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { Recording, setupProjectRecording } from '../../../../test/recording';
import { buildStepTestConfigForStep } from '../../../../test/config';
import { Steps } from '../../../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

jest.setTimeout(50000000);

test('#fetchVulnerabilities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#fetchVulnerabilities',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_VULNERABILITIES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(stepResult).toMatchSnapshot();
});

test('#buildVulnerabilityCveRelationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: '#buildVulnerabilityCveRelationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.VULNERABILITY_CVE_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchSnapshot();
});
