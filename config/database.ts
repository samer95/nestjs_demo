import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  logging: process.env.DB_LOGGING === 'true',
  autoLoadEntities: true,
  synchronize: process.env.APP_ENV === 'development',
  entities: ['../src/**/*.entity.{ts,js}'],
  migrations: ['../src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}));
