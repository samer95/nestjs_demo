import { Test, TestingModule } from '@nestjs/testing';
import { BlocksService } from './blocks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { transactionsRepositoryMock } from '../transactions/test-data/transactions.test-mocks';
import { Block } from './entities/block.entity';
import { blocksRepositoryMock } from './test-data/blocks.test-mocks';
import {
  BLOCKS_DATA,
  CREATE_BLOCK_DTO,
  generateBlock,
} from './test-data/blocks.test-data';
import { Connection } from 'typeorm';
import { connectionMock } from '../users/test-data/users.test-mocks';

describe('BlocksService', () => {
  let service: BlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: getRepositoryToken(Block),
          useValue: blocksRepositoryMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionsRepositoryMock,
        },
        {
          provide: Connection,
          useValue: connectionMock,
        },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create a new block and its transactions if it is not existed before', () => {
    it('should create a block', async () => {
      const { transactions, ...blockData } = CREATE_BLOCK_DTO;
      expect(await service.create(CREATE_BLOCK_DTO)).toEqual({
        ...generateBlock(BLOCKS_DATA.length + 1, blockData),
        id: expect.any(Number),
      });

      expect(blocksRepositoryMock.count).toHaveBeenCalledWith({
        where: { b_number: blockData.b_number },
      });

      expect(blocksRepositoryMock.create).toHaveBeenCalledWith(blockData);
      expect(blocksRepositoryMock.save).toHaveBeenCalledWith(blockData);
    });
  });

  describe('findAll', () => {
    it('should return an array of blocks', async () => {
      const blocks = await service.findAll();
      expect(blocks).toEqual(BLOCKS_DATA);
      expect(blocks.length).toBe(BLOCKS_DATA.length);
      expect(blocksRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a block by id', async () => {
      expect(await service.findOne(BLOCKS_DATA[0].id)).toMatchObject(
        BLOCKS_DATA[0],
      );
      expect(blocksRepositoryMock.findOneOrFail).toHaveBeenCalledWith(
        BLOCKS_DATA[0].id,
      );
    });
  });
});
