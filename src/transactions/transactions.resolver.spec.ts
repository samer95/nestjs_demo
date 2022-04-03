import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { transactionsServiceMock } from './test-data/transactions.test-mocks';
import { TRANSACTIONS_DATA } from './test-data/transactions.test-data';

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsResolver,
        {
          provide: TransactionsService,
          useValue: transactionsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should get the transactions array', async () => {
      expect(await resolver.findAll()).toEqual(TRANSACTIONS_DATA);

      expect(transactionsServiceMock.findAll).toHaveBeenCalled();
    });
  });
});
