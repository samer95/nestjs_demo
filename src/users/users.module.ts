import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatesModule } from '../certificates/certificates.module';
import { UsersRepository } from './users.repository';
import { UserPermissionsRepository } from '../user-permissions/user-permissions.repository';
import { User } from './entities/user.entity';
import { CaslModule } from '../casl/casl.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      UserPermissionsRepository,
      User,
    ]),
    EventsModule,
    CertificatesModule,
    CaslModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
