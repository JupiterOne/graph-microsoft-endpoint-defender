import { createLogonUserEntity } from './converters';
import { getMockLogonUser } from '../../../../test/mocks';

test('#createLogonUserEntity', () => {
  expect(createLogonUserEntity(getMockLogonUser())).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_logon_user' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});
