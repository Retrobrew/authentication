import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from './domain/entities/post.entity';
import { PostsController } from './exposition/posts.controller';
import { PostsService } from './application/services/posts.service';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './exposition/comments.controller';
import { CommentsService } from './application/services/comments.service';
import { FeedsController } from './exposition/feeds.controller';


@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Post] }),
    UsersModule
  ],
  controllers: [
    PostsController,
    CommentsController,
    FeedsController
  ],
  providers: [
    PostsService,
    CommentsService
  ]
})
export class PostsModule{}