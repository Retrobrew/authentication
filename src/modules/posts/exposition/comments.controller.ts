import {
  Body,
  Controller, Param,
  Post, Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { CommentPostRequestDto } from '../application/dto/comment/comment-post-request.dto';
import { CommentsService } from '../application/services/comments.service';
import { CommentPostDto } from '../application/dto/comment/comment-post.dto';
import { EditCommentRequestDto } from '../application/dto/comment/edit-comment-request.dto';
import { EditCommentDto } from '../application/dto/comment/edit-comment.dto';

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

  @Put(":uuid/comment")
  async editComment(
    @Body() editCommentRequest: EditCommentRequestDto,
    @Param('uuid') uuid: string,
    @Req() req: Request
  ): Promise<void> {
    const editCommentDto = new EditCommentDto(
      req.user["userId"],
      editCommentRequest.parent,
      editCommentRequest.content,
      editCommentRequest.updatedAt
    )

    return this.commentsService.editComment(editCommentDto);
  }


}