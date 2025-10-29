import 'reflect-metadata';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { typeormOptions } from './typeorm-options';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env', '.env.local'],
  expandVariables: true,
  cache: true,
});

export default new DataSource(typeormOptions());
