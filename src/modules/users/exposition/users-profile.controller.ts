import { UsersService } from '../application/services/users.service';
import { Controller, Get, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { FriendshipService } from '../application/services/Friendship/friendship.service';
import { GroupsService } from '../../groups/application/services/groups.service';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller()
export class UsersProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendshipService: FriendshipService,
    private readonly groupsService: GroupsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.usersService.findOneByUuid(req.user['userId']);
  }

  @Get('my/friends')
  @UseGuards(JwtAuthGuard)
  getMyFriends(@Request() req) {
    return this.friendshipService.getFriends(req.user['userId']);
  }

  @Get('my/groups')
  @UseGuards(JwtAuthGuard)
  async getUserGroups(@Req() req) {
     return this.groupsService.getUserGroups(req.user['userId'])
  }

}