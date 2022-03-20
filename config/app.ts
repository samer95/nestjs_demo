import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Nestjs Demo',
  env: process.env.APP_ENV || 'development',
  url: process.env.APP_URL || 'http://localhost:3000',
  port: +process.env.APP_PORT || 3000,
  prefix: process.env.APP_PREFIX || 'api',
}));
