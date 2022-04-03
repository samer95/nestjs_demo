export const CREATE_BLOCK_DTO = {
  b_hash: 'B_HASH',
  b_number: 123,
  transactions: [
    'TRANSACTION_HASH_1',
    'TRANSACTION_HASH_2',
    'TRANSACTION_HASH_3',
  ],
};

export const BLOCKS_DATA = [
  generateBlock(1),
  generateBlock(2),
  generateBlock(3),
];

// Helpers
export function generateBlock(id: number, overrides?) {
  return {
    id,
    b_hash: `HASH-${id}`,
    b_number: 104 + id,
    created_at: '2022-04-01T11:51:01.315Z',
    updated_at: '2022-04-01T11:51:01.315Z',
    ...overrides,
  };
}

export const FETCH_BLOCKS_DATA = {
  startNumber: 1,
  resetCache: true,
};
