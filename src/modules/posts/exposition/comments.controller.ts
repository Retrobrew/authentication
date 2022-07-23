import {
  Body,
  Controller, Delete, Get, Param,
  Post, Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { CommentPostRequestDto } from '../application/dto/comment/comment-post/comment-post-request.dto';
import { CommentsService } from '../application/services/comments.service';
import { CommentPostDto } from '../application/dto/comment/comment-post/comment-post.dto';
import { EditCommentRequestDto } from '../application/dto/comment/edit-comment/edit-comment-request.dto';
import { EditCommentDto } from '../application/dto/comment/edit-comment/edit-comment.dto';
import { DeleteCommentDto } from '../application/dto/comment/delete-comment/delete-comment.dto';
import { PostCommentsDto } from '../application/dto/comment/read-comments/post-comments.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('posts')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService
  ) {}

  @Get(":uuid/comments")
  async getComments(
    @Param('uuid') postId: string,
  ): Promise<Array<PostCommentsDto>> {

    return this.commentsService.getPostComments(postId);
  }

  @Post(":uuid/comment")
  @UseGuards(JwtAuthGuard)
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
      new Date(commentPostRequest.createdAt)
    );

    return this.commentsService.commentPost(commentPostDto);
  }

  @Put(":postId/comment/:uuid")
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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