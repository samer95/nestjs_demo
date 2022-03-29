import { Certificate } from '../../certificates/entities/certificate.entity';
import { PermissionType } from '../decorators/permission-type.enum';
import { Permission } from '../entities/permission.entity';
import { User } from '../../users/entities/user.entity';

export const PERMISSIONS_DEF = [
  {
    key: 'certificates',
    object: Certificate.name,
    perm: ['m', 'c', 'r', 'u', 'd'],
    permissionType: PermissionType.CRUD, // default is CRUD
    description: 'Certificates',
  },
  {
    key: 'permissions',
    object: Permission.name,
    perm: ['m', 'r'],
    permissionType: PermissionType.CRUD, // default is CRUD
    description: 'Permissions',
  },
  {
    key: 'users',
    object: User.name,
    perm: ['m', 'c', 'r', 'u', 'd'],
    permissionType: PermissionType.CRUD, // default is CRUD
    description: 'Users',
  },
  // This is an example of a custom permission
  // {
  //   key: 'custom-key',
  //   // There is no object for custom permissions
  //   perm: ['custom-perm1', 'custom-perm2'],
  //   description: 'Custom PermissionEntity',
  //   permissionType: PermissionType.CUSTOM,
  // },
  // TODO: add more permissions here
];
