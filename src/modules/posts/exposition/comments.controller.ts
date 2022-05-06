import {
  Body,
  Controller, Delete, Param,
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
import { DeleteCommentDto } from '../application/dto/comment/delete-comment.dto';

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
    @Param('uuid') postId: string,
    @Req() req: Request
  ): Promise<string> {
    const user = req.user;

    const commentPostDto = new CommentPostDto(
      user["userId"],
      postId,
      commentPostRequest.content,
      commentPostRequest.createdAt
    );

    return this.commentsService.commentPost(commentPostDto);
  }

  @Put(":postId/comment/:uuid")
  async editComment(
    @Body() editCommentRequest: EditCommentRequestDto,
    @Param('uuid') comment: string,
    @Req() req: Request
  ): Promise<void> {
    const editCommentDto = new EditCommentDto(
      req.user["userId"],
      comment,
      editCommentRequest.content,
      editCommentRequest.updatedAt
    )

    return this.commentsService.editComment(editCommentDto);
  }

  @Delete(":postId/comment/:uuid")
  async deleteComment(
    @Param('uuid') comment: string,
    @Req() req: Request
  ): Promise<void> {
    const deleteCommentDto = new DeleteCommentDto(
      req.user["userId"],
      comment
    );

    return this.commentsService.deleteComment(deleteCommentDto);
  }


}