import { DataSource, DataSourceOptions } from 'typeorm';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} from 'src/config/env';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: ['dist/database/entity/**/*.js'],
  migrations: ['dist/database/migration/**/*.js'],
  subscribers: ['dist/database/subscriber/**/*.js'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
