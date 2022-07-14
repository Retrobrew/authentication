import {
  Body,
  Controller, Delete, Get, Param,
  Post,
  Put,
  Req, UploadedFile,
  UseGuards, UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostRequestDto } from '../application/dto/post/create-post/create-post-request.dto';
import { Request } from 'express';
import { EditPostDto } from '../application/dto/post/edit-post/edit-post.dto';
import { PostsService } from '../application/services/posts.service';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { CreatePostDto } from '../application/dto/post/create-post/create-post.dto';
import { EditPostRequestDto } from '../application/dto/post/edit-post/edit-post-request.dto';
import { DeletePostDto } from '../application/dto/post/delete-post.dto';
import { UuidDto } from '../application/dto/uuid.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { PostLikeDto } from '../application/dto/post/post-like.dto';
import { FeedPostDto } from '../application/dto/post/feed-post.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async createPost(
    @Body() createPostRequest: CreatePostRequestDto,
    @UploadedFile() media: Express.Multer.File,
    @Req() req : Request
  ): Promise<UuidDto> {

    const createPostDto     =  new CreatePostDto();
    createPostDto.author    = req.user["userId"];
    createPostDto.createdAt = new Date(createPostRequest.createdAt);
    createPostDto.content   = createPostRequest.content;
    createPostDto.title     = createPostRequest.title;
    createPostDto.media     = media ? media.buffer : null;
    createPostDto.postedIn  = createPostRequest.postedIn;

    return new UuidDto(await this.postsService.createPost(createPostDto));
  }

  @Put(":uuid/like")
  async likePost(
    @Req() req: Request,
    @Param('uuid') post: string,
  ): Promise<void> {
    const user = req.user['userId'];
    const postLikeDto = new PostLikeDto(post, user);

    return this.postsService.likePost(postLikeDto)
  }

  @Put(":uuid/unlike")
  async unlikePost(
    @Req() req: Request,
    @Param('uuid') post: string,
  ): Promise<void> {
    const user = req.user['userId'];
    const postLikeDto = new PostLikeDto(post, user);

    return this.postsService.unlikePost(postLikeDto)
  }

  @Put(":uuid")
  async editPost(
    @Body() editPostRequest: EditPostRequestDto,
    @Req() req: Request,
    @Param('uuid') post: string,
  ): Promise<void> {
    const editPostDto = new EditPostDto(
      editPostRequest.changedTitle,
      editPostRequest.changedContent,
      editPostRequest.dateOfUpdate,
      req.user["userId"],
      post
  );

    return this.postsService.editPost(editPostDto)
  }

  @Get()
  async getPosts(
    @Req() req: Request
  ) : Promise<Array<FeedPostDto>> {
    const user = req.user;
    return this.postsService.getUserPosts(user["userId"]);
  }

  @Get(":uuid")
  async getPost(
    @Param('uuid') postId: string,
    @Req() req: Request
  ): Promise<FeedPostDto> {
    return this.postsService.getPost(postId, req.user['userId']);
  }

  @Delete(":uuid")
  async deletePost(
    @Param('uuid') uuid: string,
    @Req() req: Request
  ): Promise<void> {
    const deletePostDto = new DeletePostDto(
      req.user["userId"],
      uuid
    );

    return this.postsService.deletePost(deletePostDto);
  }


}