import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { EntityRepository } from '@mikro-orm/mysql';
import { UserLink } from '../../dto/user/user-link.dto';
import { BadRequestException } from '@nestjs/common';
import { Friendship } from '../../../domain/entities/friendship.entity';

export class FriendshipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Friendship)
    private readonly friendRepository: EntityRepository<Friendship>
  ) {}

  async getFriends(userUuid: string): Promise<Array<UserLink>> {
    const user = await this.userRepository.findByUuid(userUuid);

    if(!user) {
      throw new BadRequestException("Nope");
    }
    const friends: Array<UserLink> = [];

    return this.friendRepository.find(
      {friendA: user},
      // @ts-ignore
      {fields: ['friendB',{friendB: ['uuid', 'username']}]}
    ).then(res => {
      res.forEach(friendship => {
        const friend = friendship.getFriendB();
        const link = `${process.env.API_URL}/users/${friend.getUuid()}`
        const userLink = new UserLink(friend.getUsername(), link);
        friends.push(userLink);
      })

      return friends;
    })
  }
}