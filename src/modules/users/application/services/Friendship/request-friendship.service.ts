import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { RequestFriendshipDto } from '../../dto/friendship/request-friendship.dto';
import { FriendRequest } from '../../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class RequestFriendshipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  @InjectRepository(FriendRequest)
  private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {}

  async friendshipRequest(friendshipRequestDto: RequestFriendshipDto) {
    const userUuid   = friendshipRequestDto.userUuid
    const user: User = await this.userRepository.findOne({ uuid: userUuid })

    if(!user){
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${userUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${userUuid} inconnu`);
    }

    const friendUuid = friendshipRequestDto.futurFriendUuid;
    const futurFriend: User = await this.userRepository.findOne({ uuid: friendUuid })
    if(!futurFriend){
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${friendUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${friendUuid} inconnu`);
    }

    await this.initialiseFriendsCollection(user);

    if(user.isFriendWith(futurFriend)) {
      return;
      // Lancer une erreur ou ok ?
      // Opération non permise ?
    }

    const friendRequest = new FriendRequest(
      user,
      futurFriend,
      new Date()
    );

    await this.friendRequestRepository.persistAndFlush(friendRequest);

    user.getSentFriendRequests().add(friendRequest);
    futurFriend.getFriendRequests().add(friendRequest);

    await this.initialiseRequestCollection(user);
    await this.initialiseRequestCollection(futurFriend);

    return friendRequest.getId();
  }

  //TODO Trouver un meilleur moyen de le faire
  private async initialiseRequestCollection(user: User) {
    if(!user.getFriendRequests().isInitialized()) {
      await user.getSentFriendRequests().init();
      await user.getFriendRequests().init();
    }
  }

  private async initialiseFriendsCollection(user: User) {
    if(!user.getFriends().isInitialized()) {
      await user.getFriends().init();
    }
  }


}