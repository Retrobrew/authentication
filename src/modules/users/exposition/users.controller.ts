import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Request,
  ValidationPipe, Res, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { UserRegistrationDto } from '../application/dto/user/user-registration.dto';
import { UsersService } from '../application/services/users.service';
import { JwtAuthGuard } from '../../authentication/jwt-auth-guard';
import { ChangeEmailDto } from '../application/dto/user/change-email.dto';
import { ChangeUsernameDto } from '../application/dto/user/change-username.dto';
import { ChangePasswordDto } from '../application/dto/user/change-password.dto';
import { AuthenticationService } from '../../authentication/authentication.service';
import { FriendDto } from '../application/dto/friend/friend.dto';
import { FindUserDto } from '../application/dto/user/find-user.dto';
import { UserProfileDto } from '../application/dto/user/user-profile.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../../libs/Login.dto';

@ApiTags('Users')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthenticationService
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiResponse({
    type: LoginDto
  })
  async registration (
    @Body() createUserDto: UserRegistrationDto,
    @UploadedFile() avatar?: Express.Multer.File
  ) {
    let newUser;
    try {
      newUser = await this.usersService.registrate(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    return await this.authService.login({ uuid: newUser.getUuid(), email: newUser.getEmail() });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(
    @Request() request
  ): Promise<Array<FriendDto>> {
    return this.usersService.findAll(request.user['userId']);
  }

  @Put(':uuid/email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changeEmail(
    @Param('uuid') uuid: string,
    @Body() changeEmailDto: ChangeEmailDto
  ) {
    changeEmailDto.uuid = uuid;

    return this.usersService.changeEmail(changeEmailDto);
  }

  @Put(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changeIdentity(
    @Param('uuid') uuid: string,
    @Body() changeUsernameDto: ChangeUsernameDto
  ) {
    changeUsernameDto.uuid = uuid;

    return this.usersService.changeUsername(changeUsernameDto);
  }

  @Put(':uuid/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changePassword(
    @Param('uuid') uuid: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    changePasswordDto.uuid = uuid;

    return this.usersService.changePassword(changePasswordDto);
  }

  @Get(':uuid')
  //TODO
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Get(':uuid/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getUserProfile(
    @Param('uuid') uuid: string,
    @Request() request
  ): Promise<UserProfileDto> {
    const userId = request.user['userId'];
    const findUserDto = new FindUserDto(userId, uuid)

    return this.usersService.getUserProfile(findUserDto);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('uuid') uuid: string) {
    this.usersService.findOneByUuid(uuid)
      .then((user) => {
        this.usersService.remove(user);
      });
  }

  @Get(':uuid/avatar')
  @ApiProduces('image/jpeg')
  async getAvatar(
    @Param('uuid') uuid: string, @Res() res
  ): Promise<Observable<Object>> {
    return of(
      res.sendFile(
        `${process.cwd()}/${process.env.USER_STORAGE}${uuid}/avatar.jpg`
      )
    )
  }
}
