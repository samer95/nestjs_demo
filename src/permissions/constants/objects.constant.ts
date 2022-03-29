import { Certificate } from '../../certificates/entities/certificate.entity';
import { Permission } from '../entities/permission.entity';
import { User } from '../../users/entities/user.entity';

export enum ObjectsKeys {
  Certificate = 'certificates',
  Permission = 'permissions',
  User = 'users',
  // TODO: Add more objects keys
}

export const OBJECTS = {
  Certificate,
  Permission,
  User,
  // TODO: Add more objects here
};
