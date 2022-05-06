import { PostsService } from '../application/services/posts.service';
import { Controller, Get, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { Request } from 'express';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('feeds')
@UseGuards(JwtAuthGuard)
export class FeedsController {
  constructor(
    private readonly postsService: PostsService
  ) {
  }

  @Get("my")
  async getFeed(
    @Req() req: Request
  ): Promise<Array<Object>> {
    return await this.postsService.getUserFeed(req.user["userId"]);
  }
}