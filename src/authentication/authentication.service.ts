import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    this.usersService.findOneByEmail(loginDto.email).then(user => {
      if(!user) {
        throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)
      }
      bcrypt.compare(loginDto.password, user.getPassword()).then(isMatch => {
        if(!isMatch) {
          throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)
        }
        // Renvoyer l'utilisateur sans mot de passe
        // const { password, ...result } = user;
        return user; // passer par un DTO ou une view
      });
    });

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
