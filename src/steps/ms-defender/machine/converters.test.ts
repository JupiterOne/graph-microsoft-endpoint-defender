import { createMachineEntity } from './converters';
import { getMockMachine } from '../../../../test/mocks';

test('#createMachineEntity', () => {
  expect(createMachineEntity(getMockMachine())).toMatchGraphObjectSchema({
    _class: ['Device'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_machine' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});
