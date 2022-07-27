import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './authentication/local-auth-guard.service';
import { AuthenticationService } from './authentication/authentication.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginAuthenticationDto } from './authentication/dto/login-authentication.dto';

@Controller()
@ApiTags('Authentication')
export class AppController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginAuthenticationDto
  })
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }


}
