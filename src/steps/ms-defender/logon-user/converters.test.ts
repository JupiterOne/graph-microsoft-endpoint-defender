import { createLogonUserEntity } from './converters';
import { getMockLogonUser } from '../../../../test/mocks';
import { LOGON_USER_ENTITY } from '../../../entities';

test('#createLogonUserEntity', () => {
  expect(createLogonUserEntity(getMockLogonUser())).toMatchGraphObjectSchema(
    LOGON_USER_ENTITY,
  );
});
