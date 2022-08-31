import { createFindingEntity } from './converters';
import { getMockFinding } from '../../../../test/mocks';

test('#createFindingEntity', () => {
  expect(createFindingEntity(getMockFinding())).toMatchGraphObjectSchema({
    _class: ['Finding'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_finding' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});
