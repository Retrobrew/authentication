import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';

const logger = new Logger('MikroORM');
const config: Options = {
  entities: ['./dist/src/users/entities'],
  entitiesTs: ['./src/*/entities'],
  dbName: process.env.DATABASE_NAME,
  type: 'mysql',
  port: 3306,
  debug: true,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logger: logger.log.bind(logger)
}

export default config;