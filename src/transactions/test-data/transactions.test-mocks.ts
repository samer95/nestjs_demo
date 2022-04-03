import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { TRANSACTIONS_DATA } from './transactions.test-data';
import { MockType } from '../../common/types/mock.type';

export const transactionsRepositoryMock: MockType<Repository<Transaction>> = {
  find: jest
    .fn()
    .mockImplementation(options => Promise.resolve(TRANSACTIONS_DATA)),
};

export const transactionsServiceMock = {
  findAll: jest.fn().mockResolvedValue(TRANSACTIONS_DATA),
};
