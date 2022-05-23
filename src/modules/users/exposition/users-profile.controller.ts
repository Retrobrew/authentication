import { UsersService } from '../application/services/users.service';
import { Controller, Get, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller()
export class UsersProfileController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.usersService.findOneByUuid(req.user['userId']);
  }
}