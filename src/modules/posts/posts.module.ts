import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from './domain/entities/post.entity';
import { PostsController } from './exposition/posts.controller';
import { PostsService } from './application/services/posts.service';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './exposition/comments.controller';
import { CommentsService } from './application/services/comments.service';
import { FeedsController } from './exposition/feeds.controller';
import { GroupsService } from '../groups/application/services/groups.service';
import { UsersService } from '../users/application/services/users.service';
import { Groups } from '../groups/domain/entities/groups.entity';
import { User } from '../users/domain/entities/user.entity';
import { GroupsMembership } from '../groups/domain/entities/groups-membership.entity';
import { FriendRequest } from '../users/domain/entities/friend-request.entity';


@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Post, Groups, User, GroupsMembership, FriendRequest] }),
    UsersModule
  ],
  controllers: [
    PostsController,
    CommentsController,
    FeedsController
  ],
  providers: [
    PostsService,
    CommentsService,
    GroupsService,
    UsersService
  ]
})
export class PostsModule{}