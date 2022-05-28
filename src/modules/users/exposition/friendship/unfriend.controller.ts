import {
  BadRequestException,
  Controller, HttpCode,
  Logger,
  NotFoundException,
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

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller()
export class UnfriendController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: EntityRepository<Friendship>
  ) {
  }

  @HttpCode(200)
  @Post('friends/:uuid/unfriend')
  async unfriend(
    @Req() request: Request,
    @Param('uuid')friendUuid: string
  ) {
    //TODO faire un DTO et un service
    let user = await this.getUser(request.user['userId']);
    let friend = await this.getUser(friendUuid);
    let friendship = await this.friendshipRepository.findOne({friendA: user, friendB: friend})
    if(!friendship) {
      throw new BadRequestException("You can't do that")
    }

    await this.friendshipRepository.removeAndFlush(friendship)
  }

  private async getUser(userUuid: string): Promise<User> {
    let user = await this.userRepository.findOne({uuid: userUuid}, {populate: true})

    if (!user) {
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${userUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${userUuid} inconnu`);
    }

    return user;
  }
}