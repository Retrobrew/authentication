import { EntityRepository } from '@mikro-orm/mysql';
import { Post } from '../domain/entities/post.entity';
import { User } from '../../users/domain/entities/user.entity';
import { QueryOrder } from '@mikro-orm/core';
import { Groups } from '../../groups/domain/entities/groups.entity';

export class PostRepository extends EntityRepository<Post> {
  async getUserFeed(user: User): Promise<Array<Object>> {

    /**
     * Paginer
     */
    const qb = this.qb('p').raw("SELECT\n" +
      "    friend.username as 'author',\n" +
      "    friend.uuid as \"authorId\",\n" +
      "    p.title as 'title',\n" +
      "    p.content as 'content',\n" +
      "    p.created_at as 'createdAt', \n" +
      "    p.uuid, \n" +
      "    p.posted_in_uuid " +
      "from post p\n" +
      "LEFT JOIN user friend\n" +
      "on p.author_uuid = friend.uuid\n" +
      "WHERE p.parent_uuid IS NULL " +
      "AND p.author_uuid in\n" +
      "(\n" +
      "    SELECT friend_b_uuid\n" +
      "    FROM friendship\n" +
      "    WHERE friend_a_uuid = :uuid" +
      "    );", {uuid: user.getUuid()})

    return await this.em.getConnection().execute(qb);
  }

  async getHomeFeed(): Promise<Array<Object>> {
    return this.find(
      {parent: null},
      {
        limit: 10,
        fields: [
          // @ts-ignore
          'uuid', 'title', 'comments','author', 'createdAt', 'content', 'postedIn', { author: ['uuid', 'username']}, { comments: ['uuid']}, { postedIn: ['uuid', 'name']}
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