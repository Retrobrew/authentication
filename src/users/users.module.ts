import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [ MikroOrmModule.forFeature({ entities: [User] }) ],
  controllers: [ UsersController ],
  providers: [ UsersService ],
  exports: [ UsersService ] // Requis pour l'utiliser dans auth module
})
export class UsersModule {}
