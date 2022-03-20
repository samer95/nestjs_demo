import { registerAs } from '@nestjs/config';

export default registerAs('settings', () => ({
  passSalt: +process.env.SETTINGS_PASS_SALT || 10,
  jwt: {
    expiresIn: process.env.SETTINGS_JWT_EXPIRES_IN || 604800, // 60 × 60 × 24 × 7 = 1 week
    secret: process.env.SETTINGS_JWT_SECRET || 'jwt_secret',
  },
}));
