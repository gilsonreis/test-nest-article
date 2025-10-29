import path from 'path';
import type { DataSourceOptions } from 'typeorm';

export function typeormOptions(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'root',
    database: process.env.DB_DATABASE ?? 'articles_db',
    logging: true,
    entities: [path.join(process.cwd(), 'src/app/**/*.entity{.ts,.js}')],
    migrations: [
      path.join(process.cwd(), 'src/database/migrations/*{.ts,.js}'),
    ],
  };
}
