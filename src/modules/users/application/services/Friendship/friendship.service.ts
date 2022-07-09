import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { EntityRepository } from '@mikro-orm/mysql';
import { FriendDto } from '../../dto/friend/friend.dto';
import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Friendship } from '../../../domain/entities/friendship.entity';
import { FriendRequest } from '../../../domain/entities/friend-request.entity';
import { FriendRequestStatus } from '../../../domain/friend-request-status';

export class FriendshipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Friendship)
    private readonly friendRepository: EntityRepository<Friendship>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
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

  async unfriend(friendUuid: string, userUuid: string) {
    const user = await this.getUser(userUuid);
    const friend = await this.getUser(friendUuid);

    const friendship = await this.friendRepository.findOne({friendA: user, friendB: friend})
    if(!friendship) {
      throw new BadRequestException("You can't do that")
    }

    const reverseFriendship = await this.friendRepository.findOne({friendA: friend, friendB: user})
    if(!reverseFriendship) {
      throw new BadRequestException("You can't do that")
    }

    let friendRequest = await this.friendRequestRepository.findOne({
      requester: user,
      recipient: friend,
      status: FriendRequestStatus.ACCEPTED
    })

    if(!friendRequest) {
      friendRequest = await this.friendRequestRepository.findOne({
        requester: friend,
        recipient: user,
        status: FriendRequestStatus.ACCEPTED
      })
    }


    if(!friendRequest) {
      throw new InternalServerErrorException("Could not find friend request")
    }

    await this.friendRepository.removeAndFlush(friendship);
    await this.friendRepository.removeAndFlush(reverseFriendship);
    await this.friendRequestRepository.removeAndFlush(friendRequest);
  }

  private async getUser(userUuid: string): Promise<User> {
    let user = await this.userRepository.findOne({uuid: userUuid}, {populate: true})

    if (!user) {
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${userUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${userUuid} inconnu`);
    }

    return user;
  }
}