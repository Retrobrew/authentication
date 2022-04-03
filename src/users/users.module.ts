import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [ MikroOrmModule.forFeature({ entities: [User] }) ],
  controllers: [ UsersController ],
  providers: [
    UsersService,
    UserRepository
  ],
  exports: [ UsersService ] // Requis pour l'utiliser dans auth module
})
export class UsersModule {}
