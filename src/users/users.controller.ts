import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegistrateUserDto } from './dto/registrate-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../authentication/jwt-auth-guard';
import { ChangeEmailDto } from './dto/change-email.dto';

@UsePipes(ValidationPipe)
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

  @Put(':uuid')
  @UseGuards(JwtAuthGuard)
  changeEmail(
    @Param('uuid') uuid: string,
    @Body() changeEmailDto: ChangeEmailDto
  ) {
    changeEmailDto.uuid = uuid;

    return this.usersService.changeEmail(changeEmailDto);
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
