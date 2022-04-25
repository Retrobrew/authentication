import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../user.repository';
import { RequestFriendshipDto } from '../../dto/friendship/request-friendship.dto';
import { FriendRequest } from '../../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class RequestFriendshipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {}

  async friendshipRequest(friendshipRequestDto: RequestFriendshipDto) {
    const userUuid   = friendshipRequestDto.userUuid
    const user: User = await this.userRepository.findOne({ uuid: userUuid }, {populate: true})

    if(!user){
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${userUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${userUuid} inconnu`);
    }

    const friendUuid = friendshipRequestDto.futurFriendUuid;
    const futurFriend: User = await this.userRepository.findOne({ uuid: friendUuid })
    if(!futurFriend){
      Logger.error(
        `Erreur lors de la récupération de l'utilisateur ${friendUuid}`,
        '',
        this.constructor.name
      )
      throw new NotFoundException(`Utilisateur ${friendUuid} inconnu`);
    }

    if(user.isFriendWith(futurFriend)) {
      throw new BadRequestException("Opération non permise");
    }


    if(user.hasSentRequestTo(futurFriend)) {
      throw new BadRequestException("Une demande a déjà été envoyée")
    }

    const friendRequest = new FriendRequest(
      user,
      futurFriend,
      new Date()
    );


    user.getSentFriendRequests().add(friendRequest);
    futurFriend.getFriendRequests().add(friendRequest);

    this.userRepository.persistAndFlush([user, futurFriend])

    return friendRequest.getId();
  }
}