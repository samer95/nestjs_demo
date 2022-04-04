import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BlocksService } from './blocks.service';
import { Block } from './entities/block.entity';
import { CreateBlockInput } from './dto/create-block.input';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { FetchBlocksInput } from './dto/fetch-blocks.input';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

@Resolver(() => Block)
@UseGuards(JwtAuthGuard)
export class BlocksResolver {
  constructor(
    private readonly blocksService: BlocksService,
    @InjectQueue('blocks') private readonly blocksQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  @Mutation(() => Block)
  createBlock(@Args('createBlockInput') createBlockInput: CreateBlockInput) {
    return this.blocksService.create(createBlockInput);
  }

  @Query(() => [Block], { name: 'blocks' })
  findAll() {
    return this.blocksService.findAll();
  }

  @Query(() => Block, { name: 'block' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.blocksService.findOne(id);
  }

  @ResolveField(returns => [Transaction])
  transaction(@Parent() block: Block): Promise<Transaction[]> {
    return this.blocksService.getTransactions(block.id);
  }

  @Mutation(() => String, { name: 'fetchBlocks' })
  async fetchBlocks(
    @Args('fetchBlocksInput') fetchBlocksInput: FetchBlocksInput,
  ): Promise<any> {
    const ttl = this.configService.get('settings.redis.ttl');
    const start = fetchBlocksInput.startNumber || 1;
    let blocksToFetch = await this.cacheManager.get('blocksToFetch');

    if (
      fetchBlocksInput.resetCache ||
      !blocksToFetch ||
      Object.keys(blocksToFetch).length < 1
    ) {
      // set blocks to fetch from {start} to the last block number
      const end = await this.getBlockNumber();

      // Store sections in cache
      blocksToFetch = {};
      for (let i = start; i < end; i += 101) {
        blocksToFetch[i] = {
          start: i,
          end: Math.min(i + 100, end),
        };
      }
      await this.cacheManager.set('blocksToFetch', blocksToFetch, { ttl });
    }

    const blocksToFetchKeys = Object.keys(blocksToFetch);
    for (const key of blocksToFetchKeys) {
      const block = blocksToFetch[key];
      await this.blocksQueue.add('fetchBlock', {
        start: block.start,
        end: block.end,
      });
    }

    return `*** The job has been started successfully. ${blocksToFetchKeys.length} jobs has been created ***`;
  }

  getBlockNumber(): Promise<number> {
    const infuraProjectId = this.configService.get('settings.infura.projectId');
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${infuraProjectId}`,
      ),
    );
    return web3.eth.getBlockNumber();
  }
}
