import { Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestFriendshipService } from '../../application/services/Friendship/request-friendship.service';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { RequestFriendshipDto } from '../../application/dto/friendship/request-friendship.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('users')
export class FriendRequestController {
  constructor(private readonly requestFriendshipService: RequestFriendshipService) {}

  @Post(':uuid/friend/:friendUuid/request')
  requestFriendship(
    @Req() request: Request,
    @Param('uuid') uuid: string, // potentiellement inutile
    @Param('friendUuid') friendUuid: string
  ) {
    const friendshipRequest = new RequestFriendshipDto(
      uuid,
      friendUuid
    );
    return this.requestFriendshipService.friendshipRequest(friendshipRequest)
  }

}