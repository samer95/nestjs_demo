import * as crypto from 'crypto';

export * from './web3.util';

export function generateSocketToken(
  userId: number,
  socketSecret: string,
): string {
  return crypto
    .createHash('md5')
    .update(userId + socketSecret)
    .digest('hex');
}
