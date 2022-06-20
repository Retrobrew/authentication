import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';

const logger = new Logger('MikroORM');
const config: Options = {
  forceEntityConstructor: true,
  entities: ["./dist/src/modules/*/domain/entities/*"],
  entitiesTs: ["./src/modules/*/domain/entities/*"],
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