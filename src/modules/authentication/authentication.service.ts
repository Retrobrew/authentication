import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/application/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { User } from '../users/domain/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async authenticateUser(loginDto: LoginAuthenticationDto): Promise<Object | null> {
    let user: User = await this.usersService.findOneByEmail(loginDto.email);
    if(!user) {
      throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)
    }

    let isMatch = await bcrypt.compare(loginDto.password, user.getPassword());
    if(!isMatch) {
      throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.uuid
    }

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
