import { BadRequestException, Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestFriendshipService } from '../../application/services/Friendship/request-friendship.service';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { RequestFriendshipDto } from '../../application/dto/friendship/request-friendship.dto';
import { CancelFriendshipRequestDto } from '../../application/dto/friendship/cancel-friendship-request.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Friendship')
@Controller()
export class FriendRequestController {
  constructor(
    private readonly requestFriendshipService: RequestFriendshipService
  ) {}

  @Post('users/:uuid/friendRequest')
  @ApiResponse({
    description: "Retourne l'identifiant de la demande en ami"
  })
  requestFriendship(
    @Req() request: Request,
    @Param('uuid') uuid: string
  ): Promise<number> {
    const userUuid = request.user["userId"]
    if(userUuid == uuid){
      throw new BadRequestException("You cannot be friend with yourself. Sorry.");
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