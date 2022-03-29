import { Injectable } from '@nestjs/common';
import { UserPermissionsRepository } from './user-permissions.repository';
import { UserPermission } from './entities/user-permission.entity';

@Injectable()
export class UserPermissionsService {
  constructor(private UserPermissionsRepository: UserPermissionsRepository) {}

  findAll(): Promise<UserPermission[]> {
    return this.UserPermissionsRepository.find();
  }

  findOne(id: number): Promise<UserPermission> {
    return this.UserPermissionsRepository.findOneOrFail(id);
  }
}
