import { Module } from '@nestjs/common';
import { PermissionsResolver } from './permissions.resolver';
import { CaslModule } from '../casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CaslModule],
  providers: [PermissionsResolver],
})
export class PermissionsModule {}
