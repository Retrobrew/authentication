import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Groups } from './domain/entities/groups.entity';
import { GroupsService } from './application/services/groups.service';
import { UsersModule } from '../users/users.module';
import { GroupController } from './exposition/group.controller';
import { GroupsMembership } from './domain/entities/groups_membership.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Groups, GroupsMembership] }),
    forwardRef(() => AuthenticationModule),
    UsersModule,
  ],
  controllers: [GroupController],
  providers: [GroupsService],
})
export class GroupsModule {}
