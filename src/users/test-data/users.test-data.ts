import { User } from '../entities/user.entity';
import { Action } from '../../common/enums/action.enum';
import { ObjectsKeys } from '../../permissions/constants/objects.constant';
import { UserPermission } from '../../user-permissions/entities/user-permission.entity';

export const CREATE_USER_DTO = {
  first_name: 'User FName',
  last_name: 'User LName',
  email: 'user@gmail.com',
  phone: '+905315984771',
  password: '12121212',
};

export const UPDATE_USER_DTO = {
  certificate_id: null,
  first_name: 'Updated User FName',
  last_name: 'Updated User LName',
  email: 'updated-user@gmail.com',
};

export const USERS_DATA = [generateUser(1), generateUser(2), generateUser(3)];

export const UPDATE_USER_PERMISSIONS_DTO = {
  id: 15,
  permissions: [
    {
      action: Action.Read,
      object: ObjectsKeys.Certificate,
    },
    {
      action: Action.Update,
      object: ObjectsKeys.Certificate,
    },
    {
      action: Action.Read,
      object: ObjectsKeys.User,
    },
    {
      action: Action.Update,
      object: ObjectsKeys.User,
    },
    {
      action: Action.Read,
      object: ObjectsKeys.Permission,
    },
  ],
};

export const USER_PERMISSIONS = [
  generateUserPermission(1, Action.Read, ObjectsKeys.Certificate),
  generateUserPermission(2, Action.Update, ObjectsKeys.Certificate),
  generateUserPermission(3, Action.Read, ObjectsKeys.User),
  generateUserPermission(4, Action.Update, ObjectsKeys.User),
  generateUserPermission(4, Action.Read, ObjectsKeys.Permission),
];

// Helpers
export function generateUser(id: number, overrides?: Partial<User>) {
  return {
    id,
    first_name: `UserFN-${id}`,
    last_name: `UserLN-${id}`,
    email: `user${id}@gmail.com`,
    phone: '+905315984771',
    password: '12121212',
    certificate_id: null,
    email_verified_at: null,
    phone_verified_at: null,
    gender: null,
    birthdate: null,
    about: null,
    address: null,
    image: null,
    user_type: 1,
    max_facilities_count: 1,
    lang: 'tr',
    is_admin: false,
    created_at: '2022-04-01T11:51:01.315Z',
    updated_at: '2022-04-01T11:51:01.315Z',
    ...overrides,
  };
}

function generateUserPermission(
  id: number,
  action: Action,
  object: ObjectsKeys,
  overrides?: Partial<UserPermission>,
): UserPermission {
  return {
    id,
    user_id: 1,
    action,
    object,
    created_at: '2022-04-01T11:51:01.315Z',
    updated_at: '2022-04-01T11:51:01.315Z',
    ...overrides,
  } as UserPermission;
}
