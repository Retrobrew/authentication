import { PostsService } from '../application/services/posts.service';
import { Controller, Get, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { FeedPostDto } from '../application/dto/post/feed-post.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('feeds')

export class FeedsController {
  constructor(
    private readonly postsService: PostsService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get("my")
  async getFeed(
    @Req() req: Request
  ): Promise<Array<Object>> {
    return await this.postsService.getUserFeed(req.user["userId"]);
  }

  @Get("home")
  async getHomeFeed(
    @Req() req: Request
  ): Promise<Array<FeedPostDto>> {
    return await this.postsService.getHomeFeed();
  }
}