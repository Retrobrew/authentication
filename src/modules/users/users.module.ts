import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './domain/entities/user.entity';
import { UsersController } from './exposition/users.controller';
import { UserRepository } from './application/user.repository';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RequestFriendshipService } from './application/services/Friendship/request-friendship.service';
import { FriendRequestController } from './exposition/friendship/friend-request.controller';
import { FriendRequest } from './domain/entities/friend-request.entity';
import { AnswerFriendshipRequestService } from './application/services/Friendship/answer-friendship-request.service';
import { AnswerFriendRequestController } from './exposition/friendship/answer-friend-request.controller';
import { GetFriendRequestsController } from './exposition/friendship/get-friend-requests.controller';
import { UsersProfileController } from './exposition/users-profile.controller';
import { FriendshipService } from './application/services/Friendship/friendship.service';
import { Friendship } from './domain/entities/friendship.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, FriendRequest, Friendship] }),
    forwardRef(() => AuthenticationModule)
  ],
  controllers: [
    UsersController,
    UsersProfileController,
    FriendRequestController,
    AnswerFriendRequestController,
    GetFriendRequestsController
  ],
  providers: [
    UsersService,
    UserRepository,
    RequestFriendshipService,
    AnswerFriendshipRequestService,
    FriendshipService
  ],
  exports: [ UsersService ] // Requis pour l'utiliser dans auth module
})
export class UsersModule {}
