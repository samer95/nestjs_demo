import { CacheModule, Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksResolver } from './blocks.resolver';
import { Block } from './entities/block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { BullModule } from '@nestjs/bull';
import { BlocksProcessor } from './blocks.processor';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        socket: {
          host: configService.get('settings.redis.host'),
          port: configService.get('settings.redis.port'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'blocks',
    }),
    TypeOrmModule.forFeature([Block, Transaction]),
  ],
  providers: [BlocksResolver, BlocksService, BlocksProcessor],
})
export class BlocksModule {}
