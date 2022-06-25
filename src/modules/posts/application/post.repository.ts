import { EntityRepository } from '@mikro-orm/mysql';
import { Post } from '../domain/entities/post.entity';
import { User } from '../../users/domain/entities/user.entity';
import { QueryOrder } from '@mikro-orm/core';
import { Groups } from '../../groups/domain/entities/groups.entity';

export class PostRepository extends EntityRepository<Post> {
  async getUserFeed(user: User): Promise<Array<Post>> {

    return await this.find(
      {
        $or: [
          // @ts-ignore
          { author: { $in: user.getFriends() } },
          { author: user }
        ],
        $and: [
          { parent: null }
        ]
      },
      {
        fields: [
          'uuid', 'author', { author: ['uuid', 'username'] }, 'title', 'content', 'createdAt', 'parent', 'postedIn', { postedIn: ['uuid', 'name'] }, 'comments', { comments: ['uuid', 'title']},
        ],
        orderBy: { createdAt: QueryOrder.DESC }
      }
    );
  }

  async getHomeFeed(): Promise<Array<Post>> {
    return await this.find(
      { parent: null },
      {
        limit: 10,
        fields: [
          // @ts-ignore
          'uuid', 'title', 'comments', { comments: ['uuid', 'title']}, 'author', { author: ['uuid', 'username']}, 'createdAt', 'content', 'postedIn', { postedIn: ['uuid', 'name']}
          // @ts-ignore
        ], orderBy: { createdAt: QueryOrder.DESC }
      })
  }

  async getGroupFeed(group: Groups): Promise<Array<Object>>{
    return this.find(
      {postedIn: group, parent: null},
      {
        limit: 10,
        fields: [
          // @ts-ignore
          'uuid', 'title', 'comments','author', 'createdAt', 'content', 'postedIn', { author: ['uuid', 'username']}, { comments: ['uuid']}, { postedIn: ['uuid', 'name']}
        ],
        // @ts-ignore
        orderBy: {createdAt: QueryOrder.DESC}
      }
    )
  }
}