import {
  BadRequestException,
  Body,
  Controller, Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostRequestDto } from '../application/dto/create-post-request.dto';
import { Request } from 'express';
import { EditPostDto } from '../application/dto/edit-post.dto';
import { PostsService } from '../application/services/posts.service';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {
  }

  @Post()
  async createPost(
    @Body() createPostRequest: CreatePostRequestDto,
    @Req() req : Request
  ): Promise<string> {
    const user = req.user;
    if(user["userId"] != createPostRequest.authorId) {
      throw new BadRequestException("Utilisateur connecté et créateur du post différent");
    }

    return this.postsService.createPost(createPostRequest);
  }

  @Put(":uuid")
  async editPost(
    @Body() editPost: EditPostDto,
    @Req() req: Request,
    @Param('uuid') uuid: string,
  ): Promise<void> {
    const user = req.user;

    if(user["userId"] != editPost.authorId) {
      throw new BadRequestException("Modification impossible");
    }

    editPost.postUuid = uuid;

    return this.postsService.editPost(editPost)
  }


}