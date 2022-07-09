import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../domain/entities/user.entity';
import { BadRequestException, Logger } from '@nestjs/common';

export class UserRepository extends EntityRepository<User> {

  public findByUuid(uuid : string): Promise<User> {
    return this.findOne({ uuid });
  }

  public findByEmail(email: string): Promise<User> {
    return this.findOne({ email: email });
  }

  public async findAllExceptUserAndAdmin(userId: string): Promise<Array<User>> {
    const usersToExclude = [];

    const user = await this.findOne({ uuid: userId }, { populate: true });
    if (!user) {
      throw new BadRequestException("Nope");
    }

    usersToExclude.push(user);

    const admin = await this.findOne({ username: 'admin' });
    if (!admin) {
      Logger.warn('Could not find admin in: findAllExceptUserAndAdmin');
    } else {
      usersToExclude.push(admin);
    }
    usersToExclude.push(user.getFriends())
    const x = this.qb()
      .select(['uuid', 'username', 'picture', 'country'])
      .where({
        $nin: usersToExclude,
      });
    Logger.debug(x.getFormattedQuery());
    return x.execute();
  }

}