import { Block } from '../entities/block.entity';
import { Repository } from 'typeorm';
import {
  BLOCKS_DATA,
  CREATE_BLOCK_DTO,
  generateBlock,
} from './blocks.test-data';
import { MockType } from '../../common/types/mock.type';

export const blocksRepositoryMock: MockType<Repository<Block>> = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(block => {
    Object.keys(block).forEach(
      key => block[key] === undefined && delete block[key],
    );
    return Promise.resolve(
      generateBlock(block.id || BLOCKS_DATA.length + 1, {
        ...block,
      }),
    );
  }),
  count: jest.fn().mockReturnValue(0),
  findOne: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(BLOCKS_DATA[0])),
  find: jest.fn().mockImplementation(options => Promise.resolve(BLOCKS_DATA)),
  findOneOrFail: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(BLOCKS_DATA[0])),
  delete: jest.fn().mockResolvedValue(true),
};

export const blocksServiceMock = {
  create: jest.fn().mockResolvedValue(generateBlock(50, CREATE_BLOCK_DTO)),
  findAll: jest.fn().mockResolvedValue(BLOCKS_DATA),
  findOne: jest.fn((id: number) => Promise.resolve({ ...BLOCKS_DATA[0], id })),
};

export const blocksQueueMock = {
  add: jest.fn(),
};

export const cacheManagerMock = {
  set: jest.fn(),
  get: jest.fn().mockImplementation(key => {
    switch (key) {
      // get mock values based on key
      default:
        return null;
    }
  }),
};
