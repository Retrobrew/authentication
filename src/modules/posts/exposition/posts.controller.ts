import {
  Body,
  Controller, Delete, Get, Param,
  Post,
  Put,
  Req, Res, UploadedFile,
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
import { Observable, of } from 'rxjs';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';

@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Req() req: Request,
    @Param('uuid') post: string,
  ): Promise<void> {
    const user = req.user['userId'];
    const postLikeDto = new PostLikeDto(post, user);

    return this.postsService.likePost(postLikeDto)
  }

  @Put(":uuid/unlike")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Req() req: Request,
    @Param('uuid') post: string,
  ): Promise<void> {
    const user = req.user['userId'];
    const postLikeDto = new PostLikeDto(post, user);

    return this.postsService.unlikePost(postLikeDto)
  }

  @Put(":uuid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
    return this.postsService.getPost(postId, req.user? req.user['userId']:null);
  }

  @Delete(":uuid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @ApiProduces('image/jpeg')
  @Get(':uuid/media')
  async getMedia(@Param('uuid') uuid: string, @Res() res): Promise<Observable<Object>> {
    const post = await this.postsService.getPost(uuid);
    return of(
      res.sendFile(
        `${process.cwd()}/${process.env.HOME_FEED_STORAGE}${post.media}`
      )
    )
  }


}