import { Transaction } from '../entities/transaction.entity';

export const TRANSACTIONS_DATA = [
  generateTransaction(1),
  generateTransaction(2),
  generateTransaction(3),
];

// Helpers
export function generateTransaction(
  id: number,
  overrides?: Partial<Transaction>,
) {
  return {
    id,
    block_id: 1,
    t_hash: `T_HASH-${id}`,
    created_at: '2022-04-01T11:51:01.315Z',
    updated_at: '2022-04-01T11:51:01.315Z',
    ...overrides,
  };
}
