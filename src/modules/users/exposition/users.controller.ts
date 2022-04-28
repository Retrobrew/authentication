import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegistrateUserDto } from '../application/dto/registrate-user.dto';
import { UsersService } from '../application/services/users.service';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { ChangeEmailDto } from '../application/dto/change-email.dto';
import { ChangeUsernameDto } from '../application/dto/change-username.dto';
import { ChangePasswordDto } from '../application/dto/change-password.dto';
import { AuthenticationService } from '../../authentication/authentication.service';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthenticationService
  ) {}

  @Post()
  async registration(@Body() createUserDto: RegistrateUserDto) {
    const newUser = await this.usersService.registrate(createUserDto);

    return this.authService.login({ uuid: newUser.getUuid(), email: newUser.getEmail() })
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
