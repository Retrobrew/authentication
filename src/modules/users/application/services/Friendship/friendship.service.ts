import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { EntityRepository } from '@mikro-orm/mysql';
import { FriendDto } from '../../dto/user/friend.dto';
import { BadRequestException } from '@nestjs/common';
import { Friendship } from '../../../domain/entities/friendship.entity';

export class FriendshipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Friendship)
    private readonly friendRepository: EntityRepository<Friendship>
  ) {}

  async getFriends(userUuid: string): Promise<Array<FriendDto>> {
    const user = await this.userRepository.findByUuid(userUuid);

    if(!user) {
      throw new BadRequestException("Nope");
    }
    const friends: Array<FriendDto> = [];

    return this.friendRepository.find(
      {friendA: user},
      // @ts-ignore
      {fields: ['friendB',{friendB: ['uuid', 'username', 'picture', 'country']}]}
    ).then(res => {
      res.forEach(friendship => {
        const friend = friendship.getFriendB();
        const friendDto = new FriendDto(
          friend.getUsername(),
          friend.getPicture(),
          friend.getCountry(),
          friend.getUuid()
        );
        friends.push(friendDto);
      })

      return friends;
    })
  }
}