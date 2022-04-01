import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermissionsResolver } from './user-permissions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsRepository } from './user-permissions.repository';
import { UserPermission } from './entities/user-permission.entity';
import { User } from '../users/entities/user.entity';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermission, UserPermissionsRepository, User]),
    CaslModule,
  ],
  providers: [UserPermissionsResolver, UserPermissionsService],
  exports: [TypeOrmModule, UserPermissionsService],
})
export class UserPermissionsModule {}
