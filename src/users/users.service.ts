import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { RegistrateUserDto } from './dto/registrate-user.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@Injectable()
export class UsersService {
  constructor(
    // Permet d'avoir un repository basique : pas custom
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async registrate(registrateUserDto: RegistrateUserDto) {
    const user = new User(
      registrateUserDto.email,
      registrateUserDto.firstname,
      registrateUserDto.lastname,
      registrateUserDto.password
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

  remove(user: User) {
    this.userRepository.remove(user);
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    this.findOneByUuid(changeEmailDto.uuid).then((user) => {
      user.changeEmail(changeEmailDto.email);
      this.userRepository.persistAndFlush(user);
    })
  }
}
