import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { Exists } from './common/validators/isExists';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { CaslModule } from './casl/casl.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { BlocksModule } from './blocks/blocks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BullModule } from '@nestjs/bull';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('db'),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('settings.redis.host'),
          port: configService.get('settings.redis.port'),
        },
      }),
    }),
    EventsModule,
    UsersModule,
    AuthModule,
    CertificatesModule,
    CaslModule,
    PermissionsModule,
    UserPermissionsModule,
    BlocksModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [Exists],
})
export class AppModule {}
