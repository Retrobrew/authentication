import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './authentication/local-auth-guard.service';
import { AuthenticationService } from './authentication/authentication.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }


}
