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

  async accept (answerDto: AnswerFriendshipRequestDto) {
    const userUuid = answerDto.userUuid
    const user: User = await this.userRepository.findOne({ uuid: userUuid })

    if (!user) {
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${userUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${userUuid} inconnu`);
    }

    //Récupérer la requête
    let friendshipRequest = user.getFriendRequests().getItems().find((request) => {
      return request.getRecipient().getUuid() == user.getUuid();
    })

    if(!friendshipRequest) {
      Logger.error(
        `Erreur lors de la récupération de la demande d'ami ${answerDto.requestId}`,
        '',
        this.constructor.name
      )
      throw new BadRequestException(`Erreur lors de la récupération de la demande d'ami`);
    }

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
}