import {
  createAccountEntityWithOrganization,
  createUserEntity,
} from './converters';
import {
  getMockInstance,
  getMockOrganization,
  getMockUser,
} from '../../../test/mocks';

test('#createAccountEntityWithOrganization', () => {
  expect(
    createAccountEntityWithOrganization(
      getMockInstance(),
      getMockOrganization(),
    ),
  ).toMatchGraphObjectSchema({
    _class: ['Account'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_account' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});

test('#createUserEntity', () => {
  expect(createUserEntity(getMockUser())).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_user' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});
