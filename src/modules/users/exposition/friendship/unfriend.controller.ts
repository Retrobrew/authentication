import {
  Controller, HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../authentication/jwt-auth-guard';
import { Request } from 'express';
import { User } from '../../domain/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserRepository } from '../../application/user.repository';
import { EntityRepository } from '@mikro-orm/mysql';
import { Friendship } from '../../domain/entities/friendship.entity';
import { FriendshipService } from '../../application/services/Friendship/friendship.service';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller()
export class UnfriendController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: EntityRepository<Friendship>,
    private readonly friendshipService: FriendshipService
  ) {
  }

  @HttpCode(200)
  @Post('friends/:uuid/unfriend')
  async unfriend(
    @Req() request: Request,
    @Param('uuid')friendUuid: string
  ) {
    return await this.friendshipService.unfriend(friendUuid, request.user['userId']);
  }


}