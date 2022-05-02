import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from './domain/entities/post.entity';
import { PostsController } from './exposition/posts.controller';
import { PostsService } from './application/services/posts.service';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    MikroOrmModule.forFeature({entities: [Post]}),
    UsersModule
  ],
  controllers: [
    PostsController,
  ],
  providers: [
    PostsService,
  ]
})
export class PostsModule{}