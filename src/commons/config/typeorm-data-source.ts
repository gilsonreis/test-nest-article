import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { typeormOptions } from './typeorm-options';

console.log(typeormOptions());

export default new DataSource(typeormOptions());
