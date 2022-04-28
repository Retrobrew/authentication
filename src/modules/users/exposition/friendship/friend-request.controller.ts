import { BadRequestException, Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestFriendshipService } from '../../application/services/Friendship/request-friendship.service';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { RequestFriendshipDto } from '../../application/dto/friendship/request-friendship.dto';
import { CancelFriendshipRequestDto } from '../../application/dto/friendship/cancel-friendship-request.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller()
export class FriendRequestController {
  constructor(
    private readonly requestFriendshipService: RequestFriendshipService
  ) {}

  @Post('users/:uuid/friendRequest')
  requestFriendship(
    @Req() request: Request,
    @Param('uuid') uuid: string
  ) {
    const userUuid = request.user["userId"]
    if(userUuid == uuid){
      throw new BadRequestException("Vous ne pouvez pas être ami avec vous-même, désolé.");
    }
    const friendshipRequest = new RequestFriendshipDto(
      userUuid,
      uuid
    );
    return this.requestFriendshipService.friendshipRequest(friendshipRequest)
  }


  @Post('friendRequests/sent/:requestId/cancel')
  cancelFriendship(
    @Req() request: Request,
    @Param('requestId') requestId: number
  ) {
    const cancelFriendshipRequest = new CancelFriendshipRequestDto(
      request.user["userId"],
      requestId
    );

    return this.requestFriendshipService.cancel(cancelFriendshipRequest);
  }

}