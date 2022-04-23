import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegistrateUserDto } from '../application/dto/user/registrate-user.dto';
import { UsersService } from '../application/services/users.service';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { ChangeEmailDto } from '../application/dto/user/change-email.dto';
import { ChangeUsernameDto } from '../application/dto/user/change-username.dto';
import { ChangePasswordDto } from '../application/dto/user/change-password.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  registrate(@Body() createUserDto: RegistrateUserDto) {
    return this.usersService.registrate(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':uuid/email')
  @UseGuards(JwtAuthGuard)
  changeEmail(
    @Param('uuid') uuid: string,
    @Body() changeEmailDto: ChangeEmailDto
  ) {
    changeEmailDto.uuid = uuid;

    return this.usersService.changeEmail(changeEmailDto);
  }

  @Put(':uuid')
  @UseGuards(JwtAuthGuard)
  changeIdentity(
    @Param('uuid') uuid: string,
    @Body() changeUsernameDto: ChangeUsernameDto
  ) {
    changeUsernameDto.uuid = uuid;

    return this.usersService.changeUsername(changeUsernameDto);
  }

  @Put(':uuid/password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Param('uuid') uuid: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    changePasswordDto.uuid = uuid;

    return this.usersService.changePassword(changePasswordDto);
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOneByUuid(uuid);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  remove(@Param('uuid') uuid: string) {
    this.usersService.findOneByUuid(uuid).then((user) => {
      this.usersService.remove(user);
    });

  }
}
