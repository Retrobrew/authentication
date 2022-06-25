import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../domain/entities/user.entity';
import { UserRegistrationDto } from '../dto/user/user-registration.dto';
import { ChangeEmailDto } from '../dto/user/change-email.dto';
import { ChangeUsernameDto } from '../dto/user/change-username.dto';
import { ChangePasswordDto } from '../dto/user/change-password.dto';
import { Credentials } from '../../domain/entities/credentials.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
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

  async findAll() {
    return await this.userRepository.findAll();
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
