import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Groups } from './domain/entities/groups.entity';
import { CreateGroupController } from './exposition/groups/create-group.controller';
import { GroupsService } from './application/services/groups/groups.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Groups] }),
    forwardRef(() => AuthenticationModule),
    UsersModule
  ],
  controllers: [
    CreateGroupController
  ],
  providers: [
    GroupsService
  ]
})
export class GroupsModule {}