import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async authenticateUser(email: string, password: string): Promise<Object | null> {
    const user = await this.usersService.findOneByEmail(email);
    if(user && user.getPassword() === password) {
      //Pour que ça fonctionne il faut que les propriétés de l'entity soient accessible (publiques)
      //Le sérializer ?
      // const { password, ...result } = user;

      return user; // le renvoyer sans mot de passe
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
