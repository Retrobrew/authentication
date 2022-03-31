import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async authenticateUser(loginDto: LoginAuthenticationDto): Promise<Object | null> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    const isMatch = await bcrypt.compare(loginDto.password, user.getPassword());

    if(user && isMatch) {
      // Renvoyer l'utilisateur sans mot de passe
      // const { password, ...result } = user;

      return user;
    }

    return null;
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
