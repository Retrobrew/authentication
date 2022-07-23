import { UsersService } from '../application/services/users.service';
import {
  BadRequestException,
  Controller,
  Get, HttpCode,
  Post,
  Req,
  Request, UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { FriendshipService } from '../application/services/Friendship/friendship.service';
import { GroupsService } from '../../groups/application/services/groups.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ChangeAvatarDto } from '../application/dto/user/change-avatar.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendshipService: FriendshipService,
    private readonly groupsService: GroupsService
  ) {}

  @Get('profile')
  async profile(@Request() req) {
    return this.usersService.findOneByUuid(req.user['userId']);
  }

  @Get('my/friends')
  getMyFriends(@Request() req) {
    return this.friendshipService.getFriends(req.user['userId']);
  }

  @Get('my/groups')
  async getUserGroups(@Req() req) {
     return this.groupsService.getUserGroups(req.user['userId'])
  }

  @Post('my/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(202)
  async uploadIcon(
    @Req() request,
    @UploadedFile() avatar: Express.Multer.File
  ): Promise<void> {
    const user = request.user['userId'];

    try {
      await this.usersService.changeAvatar(
        new ChangeAvatarDto(
          user,
          avatar.buffer
        )
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}