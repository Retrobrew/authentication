import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../domain/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

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
      console.log("Could not found admin")
    } else {
      usersToExclude.push(admin);
    }

    const x = this.qb()
      .select(['uuid', 'username', 'picture', 'country'])
      .where({
        $nin: user.getFriends(),
        $ne: [usersToExclude]
      });

    return x.execute();
  }

}