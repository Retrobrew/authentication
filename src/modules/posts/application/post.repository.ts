import { EntityRepository } from '@mikro-orm/mysql';
import { Post } from '../domain/entities/post.entity';
import { User } from '../../users/domain/entities/user.entity';

export class PostRepository extends EntityRepository<Post> {
  async getUserFeed(user: User): Promise<Array<Object>> {

    /**
     * TODO limiter le nombre de résultat
     * avoir des liens pour les commentaires des posts
     * Paginer
     */
    const qb = this.qb('p').raw("SELECT\n" +
      "    friend.username as 'friend',\n" +
      "    friend.uuid as \"friend Id\",\n" +
      "    p.title as 'title',\n" +
      "    p.content as 'content'\n" +
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
}