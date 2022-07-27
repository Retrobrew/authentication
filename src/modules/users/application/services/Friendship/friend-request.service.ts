import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FriendRequest } from '../../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { FriendRequestStatus } from '../../../domain/friend-request-status';
import { FriendRequestDto } from '../../dto/friendship/friend-request.dto';
import { UserDto } from '../../dto/friend/user.dto';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {
  }

  async getReceivedRequests(userUuid: string) {
    const user = await this.getUser(userUuid);
    const requests = await this.friendRequestRepository
      .find(
        {
          recipient: user,
          status: FriendRequestStatus.PENDING
        },
        // @ts-ignore
        { fields: ['id', 'requester', { requester: ['username', 'uuid', 'picture'] }, 'sentAt', 'status'] }
      );

    const dtos = [];

    requests.forEach(request => {
      dtos.push(new FriendRequestDto(
        request.getId(),
        UserDto.createFromUser(request.getRequester()),
        request.getSentAt(),
        request.getStatus()
      ));
    });

    return dtos;
  }

  async getSentRequests(userUuid: string) {
    const user = await this.getUser(userUuid);
    const requests = await this.friendRequestRepository
      .find(
        {
          requester: user
        },
        // @ts-ignore
        { fields: ['id', 'requester', { requester: ['username', 'uuid', 'picture'] }, 'sentAt', 'status'] }
      );

    const dtos = [];

    requests.forEach(request => {
      dtos.push(new FriendRequestDto(
        request.getId(),
        UserDto.createFromUser(request.getRequester()),
        request.getSentAt(),
        request.getStatus()
      ));
    });

    return dtos;
  }

  private async getUser(userUuid: string): Promise<User> {
    const user = await this.userRepository.findOne({uuid: userUuid})

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