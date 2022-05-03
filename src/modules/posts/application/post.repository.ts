import { EntityRepository } from '@mikro-orm/mysql';
import { Post } from '../domain/entities/post.entity';
import { Collection } from '@mikro-orm/core';
import { User } from '../../users/domain/entities/user.entity';

export class PostRepository extends EntityRepository<Post> {
  public getUserFeed(user: User): Promise<Collection<Post>> {
    const qb = this.qb("p")
    qb.select(
      "friend.username as 'friend'," +
      "friend.uuid as 'friendId'," +
      "p.title as 'title'," +
      "p.content as 'content'")
      .leftJoin('p.author', 'friend')
      .where({
        author: {
          '$in': {
            friends: user.getFriends()
          }
        }
      });




    return new Promise(() => {})
  }
}