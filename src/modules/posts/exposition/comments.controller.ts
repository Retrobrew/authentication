import {
  Body,
  Controller, Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { CommentPostRequestDto } from '../application/dto/comment-post-request.dto';
import { CommentsService } from '../application/services/comments.service';
import { CommentPostDto } from '../application/dto/comment-post.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService
  ) {}

  @Post(":uuid/comment")
  async commentPost(
    @Body() commentPostRequest: CommentPostRequestDto,
    @Param('uuid') uuid: string,
    @Req() req: Request
  ): Promise<string> {
    const user = req.user;

    const commentPostDto = new CommentPostDto(
      user["userId"],
      commentPostRequest.parent,
      commentPostRequest.content,
      commentPostRequest.createdAt
    );

    return this.commentsService.commentPost(commentPostDto);
  }


}