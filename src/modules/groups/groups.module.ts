import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Groups } from './domain/entities/groups.entity';
import { CreateGroupController } from './exposition/groups/create-group.controller';
import { GroupsService } from './application/services/groups/groups.service';
import { UsersService } from '../users/application/services/users.service';
import { UserRepository } from '../users/application/user.repository';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Groups] }),
    forwardRef(() => AuthenticationModule),
    UsersService
  ],
  controllers: [
    CreateGroupController
  ],
  providers: [
    GroupsService,
    UserRepository
  ]
})
export class GroupsModule {}