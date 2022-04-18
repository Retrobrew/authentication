import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { LoginAuthenticationDto } from '../dto/login-authentication.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // LoginStrategy
  constructor(private authService: AuthenticationService) {
    // Si on utilise pas username il faut le spécifier dans le constructeur
    super({ usernameField: 'email' });
  }

  // obg de s'appeler validate
  async validate(email: string, password: string): Promise<any> {
    const loginAuthenticationDto: LoginAuthenticationDto = new LoginAuthenticationDto(
      email,
      password
    );

    const user = await this.authService.authenticateUser(loginAuthenticationDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
