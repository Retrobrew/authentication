import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async authenticateUser(email: string, password: string): Promise<Object | null> {
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.getPassword()); // faire la vérif ailleurs : dans VO Credentials ?

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
