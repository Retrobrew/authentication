import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './domain/entities/user.entity';
import { UsersController } from './exposition/users.controller';
import { UserRepository } from './application/user.repository';
import { RequestFriendshipService } from './application/services/Friendship/request-friendship.service';
import { FriendRequestController } from './exposition/friendship/friend-request.controller';
import { FriendRequest } from './domain/entities/friend-request.entity';
import { AnswerFriendshipRequestService } from './application/services/Friendship/answer-friendship-request.service';

@Module({
  imports: [ MikroOrmModule.forFeature({ entities: [User, FriendRequest] }) ],
  controllers: [ UsersController, FriendRequestController ],
  providers: [
    UsersService,
    UserRepository,
    RequestFriendshipService,
    AnswerFriendshipRequestService
  ],
  exports: [ UsersService ] // Requis pour l'utiliser dans auth module
})
export class UsersModule {}
