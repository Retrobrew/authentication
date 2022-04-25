import { Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestFriendshipService } from '../../application/services/Friendship/request-friendship.service';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { AnswerFriendshipRequestDto } from '../../application/dto/friendship/answer-friendship-request.dto';
import {
  AnswerFriendshipRequestService
} from '../../application/services/Friendship/answer-friendship-request.service';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('friendRequests/received')
export class AnswerFriendRequestController {
  constructor(
    private readonly requestFriendshipService: RequestFriendshipService,
    private readonly answerFriendshipRequestService: AnswerFriendshipRequestService
  ) {}

  @Post(':requestId/accept')
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

  @Post(':requestId/decline')
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

}