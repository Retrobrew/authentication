import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './domain/entities/user.entity';
import { UsersController } from './exposition/users.controller';
import { UserRepository } from './application/user.repository';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    forwardRef(() => AuthenticationModule)
  ],
  controllers: [ UsersController ],
  providers: [
    UsersService,
    UserRepository
  ],
  exports: [ UsersService ] // Requis pour l'utiliser dans auth module
})
export class UsersModule {}
