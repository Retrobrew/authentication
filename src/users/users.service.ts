import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { RegistrateUserDto } from './dto/registrate-user.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangeIdentityDto } from './dto/change-identity.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Credentials } from './entities/credentials.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // Permet d'avoir un repository basique : pas custom
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async registrate(registrateUserDto: RegistrateUserDto) {
    const salt = bcrypt.genSalt();
    const password = bcrypt.hash(registrateUserDto.password, await salt);

    const credentials = new Credentials(await password, await salt);
    const user = new User(
      registrateUserDto.email,
      registrateUserDto.firstname,
      registrateUserDto.lastname,
      credentials
    );

    // this.userRepository.registrate(user);
    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOneByUuid(uuid: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ uuid: uuid });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email: email });
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

  async changeIdentity(changeIdentityDto: ChangeIdentityDto){
    let user = await this.findOneByUuid(changeIdentityDto.uuid);

    if(!(user instanceof User)){
      throw new Error("User not found");
    }

    user.changeFirstname(changeIdentityDto.firstname);
    user.changeLastname(changeIdentityDto.lastname);

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
