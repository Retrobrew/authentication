import { Controller, Get, Logger, NotFoundException, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FriendRequest } from '../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { Request } from 'express';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/user.repository';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('friendRequests')
export class GetFriendRequestsController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {
  }

  @Get('received')
  async getReceivedRequests(@Req() request: Request) {
    let user = await this.getUser(request.user['userId']);

    return this.friendRequestRepository.find({ recipient: user });
  }

  @Get('sent')
  async getSentRequests(@Req() request: Request) {
    let user = await this.getUser(request.user['userId']);

    return this.friendRequestRepository.find({ requester: user });
  }

  private async getUser(userUuid: string): Promise<User> {
    let user = await this.userRepository.findOne({uuid: userUuid})

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