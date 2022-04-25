import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { RequestFriendshipDto } from '../../dto/friendship/request-friendship.dto';
import { FriendRequest } from '../../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { FriendRequestStatus } from '../../../domain/friend-request-status';
import { CancelFriendshipRequestDto } from '../../dto/friendship/cancel-friendship-request.dto';

@Injectable()
export class RequestFriendshipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {}

  async friendshipRequest(friendshipRequestDto: RequestFriendshipDto): Promise<number> {
    const user: User = await this.getUser(friendshipRequestDto.userUuid);

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

    if(user.isFriendWith(futurFriend)) {
      throw new BadRequestException("Opération non permise");
    }


    if(user.hasSentRequestTo(futurFriend)) {
      throw new BadRequestException("Une demande a déjà été envoyée")
    }

    const friendRequest = new FriendRequest(
      user,
      futurFriend,
      new Date()
    );

    user.getSentFriendRequests().add(friendRequest);
    futurFriend.getFriendRequests().add(friendRequest);

    await this.userRepository.persistAndFlush([user, futurFriend])

    return friendRequest.getId();
  }

  async cancel(cancelDto: CancelFriendshipRequestDto): Promise<void> {
    const user: User        = await this.getUser(cancelDto.userUuid);
    const friendshipRequest = this.getSentFriendshipRequest(user, cancelDto.requestId);

    if(friendshipRequest.getStatus() != FriendRequestStatus.PENDING) {
      Logger.error(
        `Demande d'ami déjà traîtée ${cancelDto.requestId}`,
        '',
        this.constructor.name
      )
      throw new BadRequestException("Impossible d'annuler cette demande d'ami")
    }

    await this.friendRequestRepository.removeAndFlush(friendshipRequest);
  }


  private getSentFriendshipRequest(user: User, requestId: number): FriendRequest {
    let friendshipRequest = user.getSentFriendRequests().getItems().find((request) => {
      return request.getId() == requestId;
    })

    if(!friendshipRequest) {
      Logger.error(
        `Erreur lors de la récupération de la demande d'ami ${requestId}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Demande d'ami inconnu`);
    }

    return friendshipRequest;
  }

  // Faire un service userProvider
  private async getUser(userUuid: string): Promise<User> {
    let user = await this.userRepository.findOne({uuid: userUuid}, { populate: true })

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