import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { transactionsRepositoryMock } from './test-data/transactions.test-mocks';
import { TRANSACTIONS_DATA } from './test-data/transactions.test-data';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = await service.findAll();
      expect(transactions).toEqual(TRANSACTIONS_DATA);
      expect(transactions.length).toBe(TRANSACTIONS_DATA.length);
      expect(transactionsRepositoryMock.find).toHaveBeenCalled();
    });
  });
});
