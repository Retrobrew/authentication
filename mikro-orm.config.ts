import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { User } from './src/modules/users/domain/entities/user.entity';
import { Credentials } from './src/modules/users/domain/entities/credentials.entity';

const logger = new Logger('MikroORM');
const config: Options = {
  entities: [User, Credentials],
  entitiesTs: [User, Credentials],
  dbName: process.env.DATABASE_NAME,
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  debug: true,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logger: logger.log.bind(logger)
}

export default config;