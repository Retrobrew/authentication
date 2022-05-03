import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../domain/entities/user.entity';

export class UserRepository extends EntityRepository<User> {

  public findByUuid(uuid : string): Promise<User> {
    return this.findOne({ uuid });
  }

  public findByEmail(email: string): Promise<User> {
    return this.findOne({ email: email });
  }


}