import { PostsService } from '../application/services/posts.service';
import { BadRequestException, Controller, Get, Param, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { FeedPostDto } from '../application/dto/post/feed-post.dto';
import { Groups } from '../../groups/domain/entities/groups.entity';
import { GroupsService } from '../../groups/application/services/groups.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Feed')
@Controller('feeds')
export class FeedsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly groupsService: GroupsService
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("my")
  async getFeed(
    @Req() req: Request
  ): Promise<Array<FeedPostDto>> {
    return await this.postsService.getUserFeed(req.user["userId"]);
  }

  @Get("home")
  async getHomeFeed(
    @Req() req: Request
  ): Promise<Array<FeedPostDto>> {
    try {
      return await this.postsService.getHomeFeed();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("group/:groupUuid")
  async getGroupFeed(
    @Req() req: Request,
    @Param('groupUuid') groupUuid: string
  ): Promise<Array<FeedPostDto>> {
    const user = req.user["userId"];

    const group: Groups = await this.groupsService.find(groupUuid);

    return await this.postsService.getGroupFeed(group, user);
  }
}