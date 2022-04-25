import { AnswerFriendshipRequestDto } from '../../dto/friendship/answer-friendship-request.dto';
import { User } from '../../../domain/entities/user.entity';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserRepository } from '../../user.repository';
import { FriendRequest } from '../../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { FriendRequestStatus } from '../../../domain/friend-request-status';

export class AnswerFriendshipRequestService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {}

  async accept (answerDto: AnswerFriendshipRequestDto): Promise<void> {
    const user: User = await this.getUser(answerDto.userUuid)

    let friendshipRequest = this.getFriendshipRequest(user, answerDto.requestId);

    if(friendshipRequest.getStatus() != FriendRequestStatus.PENDING) {
      Logger.error(
        `Demande d'ami déjà traîtée ${answerDto.requestId}`,
        '',
        this.constructor.name
      )
      throw new BadRequestException("Impossible de répondre deux fois à une demande d'ami")
    }

    friendshipRequest.updateStatus(FriendRequestStatus.ACCEPTED);

    await this.friendRequestRepository.persistAndFlush(friendshipRequest);
    const requester = friendshipRequest.getRequester();

    user.addFriend(requester);
    requester.addFriend(user);

    await this.userRepository.persistAndFlush([user, requester]);
  }

  async decline(answerDto: AnswerFriendshipRequestDto){
    //TODO ajouter un temps avant que requester puisse refaire une demande
    const user: User        = await this.getUser(answerDto.userUuid);
    const friendshipRequest = this.getSentFriendshipRequest(user, answerDto.requestId);

    friendshipRequest.updateStatus(FriendRequestStatus.DECLINED);

    await this.friendRequestRepository.persistAndFlush(friendshipRequest);

  }

  async cancel(answerDto: AnswerFriendshipRequestDto){
    const user: User        = await this.getUser(answerDto.userUuid);
    const friendshipRequest = this.getFriendshipRequest(user, answerDto.requestId);

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
      throw new BadRequestException(`Erreur lors de la récupération de la demande d'ami`);
    }

    return friendshipRequest;
  }

  private getFriendshipRequest(user: User, requestId: number): FriendRequest {
    let friendshipRequest = user.getFriendRequests().getItems().find((request) => {
      return request.getId() == requestId;
    })

    if(!friendshipRequest) {
      Logger.error(
        `Erreur lors de la récupération de la demande d'ami ${requestId}`,
        '',
        this.constructor.name
      )
      throw new BadRequestException(`Erreur lors de la récupération de la demande d'ami`);
    }

    return friendshipRequest;
  }

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