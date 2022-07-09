import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../domain/entities/user.entity';
import { UserRegistrationDto } from '../dto/user/user-registration.dto';
import { ChangeEmailDto } from '../dto/user/change-email.dto';
import { ChangeUsernameDto } from '../dto/user/change-username.dto';
import { ChangePasswordDto } from '../dto/user/change-password.dto';
import { Credentials } from '../../domain/entities/credentials.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { FriendDto } from '../dto/friend/friend.dto';
import { FindUserDto } from '../dto/user/find-user.dto';
import { FriendRequest } from '../../domain/entities/friend-request.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { UserProfileDto } from '../dto/user/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: EntityRepository<FriendRequest>
  ) {}

  async registrate(registrationDto: UserRegistrationDto): Promise<User> {
    let newUser = await this.userRepository.findByEmail(registrationDto.email);
    if(newUser) {
      throw new BadRequestException("Un compte avec cette adresse mail existe déjà");
    }

    const salt     = bcrypt.genSalt();
    const password = bcrypt.hash(registrationDto.password, await salt);
    const dateOfBirth = new Date(registrationDto.dateOfBirth);
    const credentials = new Credentials(await password, await salt);
    const user = new User(
      registrationDto.email,
      registrationDto.username,
      dateOfBirth,
      registrationDto.sexe,
      registrationDto.country,
      credentials
    );

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async findAll(userId: string): Promise<Array<FriendDto>> {
    const users = await this.userRepository.findAllExceptUserAndAdmin(userId);
    const friends: Array<FriendDto> = [];

    users.forEach((user: any) => {
      const friendDto = new FriendDto(
        user.username,
        user.picture,
        user.country,
        user.uuid
      );
      friends.push(friendDto);
    });

    return friends;
  }

  async getUserProfile(findUser: FindUserDto): Promise<UserProfileDto> {
    const connectedUser: User = await this.userRepository.findOne(
      { uuid: findUser.userUuid },
      // @ts-ignore
      { populate: true }
    );

    if(!connectedUser){
      throw new NotFoundException("User not found");
    }

    const userToFind: User = await this.userRepository.findOne(
      { uuid: findUser.userToFindUuid },
      // @ts-ignore
      { populate: ['friends.friendB.uuid'] }
    );

    if(!userToFind){
      throw new NotFoundException("User not found");
    }

    const friendRequest: FriendRequest = await this.friendRequestRepository.findOne(
      {
        // @ts-ignore
        requester: connectedUser,
        recipient: userToFind
      }
    );

    let friendshipStatus = null;
    if(friendRequest) {
      friendshipStatus = friendRequest.getStatus()
    }

    return new UserProfileDto(
      userToFind.getUuid(),
      userToFind.getUsername(),
      userToFind.getPicture(),
      userToFind.getGender(),
      userToFind.getCountry(),
      userToFind.getDateOfBirth(),
      friendshipStatus
    );
  }

  async findOneByUuid(uuid: string): Promise<User | undefined> {
    // @ts-ignore
    return await this.userRepository.findOne({ uuid: uuid }, { populate: ['friends.friendB.uuid'] });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }

  async remove(user: User) {
    await this.userRepository.removeAndFlush(user)
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    this.findOneByUuid(changeEmailDto.uuid).then((user) => {
      user.changeEmail(changeEmailDto.email);
      this.userRepository.persistAndFlush(user);
    })
  }

  async changeUsername(changeUsernameDto: ChangeUsernameDto){
    let user = await this.findOneByUuid(changeUsernameDto.uuid);

    if(!(user instanceof User)){
      throw new Error("User not found");
    }

    user.changeUsername(changeUsernameDto.username);

    await this.userRepository.persistAndFlush(user);
  }

  async changePassword(changePasswordDto: ChangePasswordDto){
    let user = await this.findOneByUuid(changePasswordDto.uuid);

    if(!(user instanceof User)){
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.password,
      user.getSalt()
    )

    await user.changePassword(hashedPassword);

    await this.userRepository.persistAndFlush(user);
  }

}
