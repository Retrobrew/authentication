import { Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestFriendshipService } from '../../application/services/Friendship/request-friendship.service';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { RequestFriendshipDto } from '../../application/dto/friendship/request-friendship.dto';
import { AnswerFriendshipRequestDto } from '../../application/dto/friendship/answer-friendship-request.dto';
import {
  AnswerFriendshipRequestService
} from '../../application/services/Friendship/answer-friendship-request.service';
import { CancelFriendshipRequestDto } from '../../application/dto/friendship/cancel-friendship-request.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('users')
export class FriendRequestController {
  constructor(
    private readonly requestFriendshipService: RequestFriendshipService,
    private readonly answerFriendshipRequestService: AnswerFriendshipRequestService
  ) {}

  @Post(':uuid/friendRequest')
  requestFriendship(
    @Req() request: Request,
    @Param('uuid') uuid: string
  ) {
    const friendshipRequest = new RequestFriendshipDto(
      request.user["userId"],
      uuid
    );
    return this.requestFriendshipService.friendshipRequest(friendshipRequest)
  }

  @Post('friendRequest/received/:requestId/accept')
  acceptFriendship(
    @Req() request: Request,
    @Param('requestId') requestId: number
  ) {
    const answerFriendShipRequest = new AnswerFriendshipRequestDto(
      request.user["userId"],
      requestId
    );

    return this.answerFriendshipRequestService.accept(answerFriendShipRequest);
  }

  @Post('friendRequest/received/:requestId/decline')
  declineFriendship(
    @Req() request: Request,
    @Param('requestId') requestId: number
  ) {
    const answerFriendShipRequest = new AnswerFriendshipRequestDto(
      request.user["userId"],
      requestId
    );

    return this.answerFriendshipRequestService.decline(answerFriendShipRequest);
  }

  @Post('friendRequest/sent/:requestId/cancel')
  cancelFriendship(
    @Req() request: Request,
    @Param('requestId') requestId: number
  ) {
    const cancelFriendshipRequest = new CancelFriendshipRequestDto(
      request.user["userId"],
      requestId
    );

    return this.answerFriendshipRequestService.cancel(cancelFriendshipRequest);
  }

}