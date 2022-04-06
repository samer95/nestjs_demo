import { registerAs } from '@nestjs/config';

export default registerAs('settings', () => ({
  passSalt: +process.env.SETTINGS_PASS_SALT || 10,
  jwt: {
    expiresIn: process.env.SETTINGS_JWT_EXPIRES_IN || 604800, // 60 × 60 × 24 × 7 = 1 week
    secret: process.env.SETTINGS_JWT_SECRET || 'jwt_secret',
  },
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    ttl: process.env.REDIS_TTL || 86400, // 60 * 60 * 24 = 1 day
  },
  socket: {
    secret: process.env.SOCKET_SECRET || 'socket_secret',
  },
}));
