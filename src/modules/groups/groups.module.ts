import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Groups } from './domain/entities/groups.entity';
import { GroupsService } from './application/services/groups.service';
import { UsersModule } from '../users/users.module';
import { GroupController } from './exposition/group.controller';
import { GroupsMembership } from './domain/entities/groups-membership.entity';
import { UsersService } from '../users/application/services/users.service';
import { User } from '../users/domain/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Groups, GroupsMembership, User] }),
    UsersModule,
  ],
  controllers: [
    GroupController
  ],
  providers: [
    GroupsService,
    UsersService
  ],
})
export class GroupsModule {}
