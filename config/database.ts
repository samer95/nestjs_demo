import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'samer',
  password: process.env.DB_PASSWORD || 'P@ssw0rd',
  database: process.env.DB_DATABASE || 'nestjs_demo',
  logging: true,
  autoLoadEntities: true,
  synchronize: process.env.MODE === 'development',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}));
