import { Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestFriendshipService } from '../../application/services/Friendship/request-friendship.service';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { RequestFriendshipDto } from '../../application/dto/friendship/request-friendship.dto';
import { AnswerFriendshipRequestDto } from '../../application/dto/friendship/answer-friendship-request.dto';
import {
  AnswerFriendshipRequestService
} from '../../application/services/Friendship/answer-friendship-request.service';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('users')
export class FriendRequestController {
  constructor(
    private readonly requestFriendshipService: RequestFriendshipService,
    private readonly answerFriendshipRequestService: AnswerFriendshipRequestService
  ) {}

  @Post(':uuid/friend/:friendUuid/request')
  requestFriendship(
    @Req() request: Request,
    @Param('uuid') uuid: string, // potentiellement inutile
    @Param('friendUuid') friendUuid: string
  ) {
    console.log(request.user);
    const friendshipRequest = new RequestFriendshipDto(
      uuid,
      friendUuid
    );
    return this.requestFriendshipService.friendshipRequest(friendshipRequest)
  }

  @Post(':uuid/friendRequest/:requestId/accept')
  acceptFriendship(
    @Req() request: Request,
    @Param('uuid') uuid: string, // potentiellement inutile
    @Param('requestId') requestId: number
  ) {
    const answerFriendShipRequest = new AnswerFriendshipRequestDto(
      uuid,
      requestId
    );

    return this.answerFriendshipRequestService.accept(answerFriendShipRequest);
  }

}