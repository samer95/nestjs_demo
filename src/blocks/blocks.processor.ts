import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { BlocksService } from './blocks.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

@Processor('blocks')
export class BlocksProcessor {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private blocksService: BlocksService,
  ) {}

  private readonly logger = new Logger(BlocksProcessor.name);

  @Process('fetchBlock')
  async handleFetchBlock(job: Job) {
    let blocksToFetch = <any>await this.cacheManager.get('blocksToFetch');
    const ttl = this.configService.get('settings.redis.ttl');
    const { start = 1, end = 100 } = job.data;

    const infuraProjectId = this.configService.get('settings.infura.projectId');
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${infuraProjectId}`,
      ),
    );

    for (let i = start; i <= end; i++) {
      this.logger.debug(`Processing block number (${i}) ....`);
      try {
        if (await this.blocksService.isExists(i)) {
          this.logger.debug(`Block number (${i}) already exists in database`);
          continue;
        }
        const block = await web3.eth.getBlock(i);
        if (block?.transactions) {
          const transactions = [];
          for (const hash of block.transactions) {
            this.logger.log(`Processing: ${hash}`);
            const trans = await web3.eth.getTransaction(hash);
            const val = trans.value / 1;
            let balance_from = null;
            let balance_to = null;
            if (trans.from) {
              balance_from = await web3.eth.getBalance(trans.from);
              balance_from = balance_from / 1 - val;
            }
            if (trans.to) {
              balance_to = await web3.eth.getBalance(trans.to);
              balance_to = balance_to / 1 + val;
            }
            transactions.push({ hash, balance_from, balance_to });
          }
          const newBlockData = {
            b_number: block.number,
            b_hash: block.hash,
            transactions,
          };
          await this.blocksService.create(newBlockData);
        }
      } catch (e) {
        this.logger.error(`Error processing block number (${i}) ....`, e);
      }
    }

    blocksToFetch = blocksToFetch || {};
    delete blocksToFetch[start];
    await this.cacheManager.set('blocksToFetch', blocksToFetch, { ttl });
    this.logger.debug(
      `Process done and (${start}) key has been removed from blocksToFetch *****`,
    );
  }
}
