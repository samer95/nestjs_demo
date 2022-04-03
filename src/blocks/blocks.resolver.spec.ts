import { Test, TestingModule } from '@nestjs/testing';
import { BlocksResolver } from './blocks.resolver';
import { BlocksService } from './blocks.service';
import {
  blocksQueueMock,
  blocksServiceMock,
  cacheManagerMock,
} from './test-data/blocks.test-mocks';
import { getQueueToken } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configServiceMock } from '../users/test-data/users.test-mocks';
import {
  BLOCKS_DATA,
  CREATE_BLOCK_DTO,
  FETCH_BLOCKS_DATA,
  generateBlock,
} from './test-data/blocks.test-data';

jest.mock('web3');

describe('BlocksResolver', () => {
  let resolver: BlocksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksResolver,
        {
          provide: BlocksService,
          useValue: blocksServiceMock,
        },
        {
          provide: getQueueToken('blocks'),
          useValue: blocksQueueMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<BlocksResolver>(BlocksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createBlock', () => {
    it('should create a new block', async () => {
      expect(await resolver.createBlock(CREATE_BLOCK_DTO)).toEqual({
        ...generateBlock(BLOCKS_DATA.length + 1, CREATE_BLOCK_DTO),
        id: expect.any(Number),
      });

      expect(blocksServiceMock.create).toHaveBeenCalledWith(CREATE_BLOCK_DTO);
    });
  });

  describe('findAll', () => {
    it('should get the blocks array', async () => {
      expect(await resolver.findAll()).toEqual(BLOCKS_DATA);

      expect(blocksServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get one block', async () => {
      expect(await resolver.findOne(BLOCKS_DATA[0].id)).toEqual({
        ...BLOCKS_DATA[0],
      });

      expect(blocksServiceMock.findOne).toHaveBeenCalledWith(BLOCKS_DATA[0].id);
    });
  });

  describe('fetchBlocks', () => {
    it('should fetch all blocks of ethereum from number 1 to latest', async () => {
      jest.spyOn(resolver, 'getBlockNumber').mockResolvedValue(3);

      expect(await resolver.fetchBlocks(FETCH_BLOCKS_DATA)).toEqual(
        `*** The job has been started successfully will start from ${FETCH_BLOCKS_DATA.startNumber} number ***`,
      );

      expect(configServiceMock.get).toHaveBeenCalledWith('settings.redis.ttl');
      expect(cacheManagerMock.get).toHaveBeenCalledWith('blocksToFetch');
      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        'blocksToFetch',
        expect.any(Object),
        { ttl: expect.any(Number) },
      );
      expect(blocksQueueMock.add).toHaveBeenCalledWith('fetchBlock', {
        start: expect.any(Number),
        end: expect.any(Number),
      });
    });
  });
});
