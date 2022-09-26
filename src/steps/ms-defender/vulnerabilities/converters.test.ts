import { createVulnerabilityEntity } from './converters';
import { getMockVulnerability } from '../../../../test/mocks';

test('#createVulnerabilityEntity', () => {
  expect(
    createVulnerabilityEntity(getMockVulnerability()),
  ).toMatchGraphObjectSchema({
    _class: ['Finding'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_vulnerability' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});
