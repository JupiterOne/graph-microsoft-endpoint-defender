import { createVulnerabilityEntity } from './converters';
import { getMockVulnerability } from '../../../../test/mocks';
import { VULNERABILITY_ENTITY } from '../../../entities';

test('#createVulnerabilityEntity', () => {
  expect(
    createVulnerabilityEntity(getMockVulnerability()),
  ).toMatchGraphObjectSchema(VULNERABILITY_ENTITY);
});
