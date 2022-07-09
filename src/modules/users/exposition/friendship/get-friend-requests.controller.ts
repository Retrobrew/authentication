import { Controller, Get, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FriendRequest } from '../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { Request } from 'express';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/user.repository';
import { FriendRequestService } from '../../application/services/Friendship/friend-request.service';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('friendRequests')
export class GetFriendRequestsController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly friendRequestService: FriendRequestService,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {
  }

  @Get('received')
  async getReceivedRequests(@Req() request: Request) {
    return this.friendRequestService.getReceivedRequests(request.user['userId']);
  }

  @Get('sent')
  async getSentRequests(@Req() request: Request) {
    return this.friendRequestService.getSentRequests(request.user['userId']);
  }
}