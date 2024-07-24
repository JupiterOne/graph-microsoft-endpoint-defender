import {
  createAccountEntityWithOrganization,
  createUserEntity,
} from './converters';
import {
  getMockInstance,
  getMockOrganization,
  getMockUser,
} from '../../../test/mocks';
import { ACCOUNT_ENTITY, USER_ENTITY } from '../../entities';

test('#createAccountEntityWithOrganization', () => {
  expect(
    createAccountEntityWithOrganization(
      getMockInstance(),
      getMockOrganization(),
    ),
  ).toMatchGraphObjectSchema(ACCOUNT_ENTITY);
});

test('#createUserEntity', () => {
  expect(createUserEntity(getMockUser())).toMatchGraphObjectSchema(USER_ENTITY);
});
