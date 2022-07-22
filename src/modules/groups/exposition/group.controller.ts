import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put, Req, Res, UploadedFiles,
  UseGuards, UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/authentication/jwt-auth-guard';
import { CreateGroupDto } from '../application/dto/create-group.dto';
import { GroupsService } from '../application/services/groups.service';
import { ModifyGroupDto } from '../application/dto/modify-group.dto';
import { Groups } from '../domain/entities/groups.entity';
import { Express, Request } from 'express';
import { DeleteGroupDto } from '../application/dto/delete-group.dto';
import { JoinGroupDto } from '../application/dto/join-group.dto';
import { QuitGroupDto } from '../application/dto/quit-group.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';

@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
@Controller('groups/')
export class GroupController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getALl(): Promise<Groups[]> {
    try {
      return await this.groupsService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  async get(@Param('uuid') uuid: string): Promise<Groups> {
    try {
      return await this.groupsService.find(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'icon', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]))
  @HttpCode(202)
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFiles() files: {icon?: Express.Multer.File, banner?: Express.Multer.File},
    @Req() req: Request
  ) {
    createGroupDto.userUuid= req.user['userId'];

    try {
      const group = await this.groupsService.create(createGroupDto);
      const groupStorage = `${process.env.GROUP_STORAGE}${group.getUuid()}`;
      if(!fs.existsSync(groupStorage)){
        fs.mkdirSync(groupStorage, { recursive: true })
        fs.copyFile(`${process.cwd()}/assets/${group.picture}`, `${groupStorage}/${group.picture}`, (err) => {
          console.log(err);
        })
        fs.copyFile(`${process.cwd()}/assets/${group.banner}`, `${groupStorage}/${group.banner}`, (err) => {
          console.log(err);
        })
      }
      const iconFile = groupStorage + '/' + group.picture;
      const bannerFile = groupStorage + '/' + group.banner;

      if(files.icon) {
        fs.writeFile(iconFile, files.icon[0].buffer, function(err){
          console.log(err);
        });
      }

      if(files.banner){
        fs.writeFile(bannerFile ,files.banner[0].buffer, function(err){
          console.log(err);
        });
      }

      return group;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(202)
  async update(@Body() modifyGroupDto: ModifyGroupDto) {
    try {
      await this.groupsService.modify(modifyGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(202)
  async remove(
    @Req() request: Request,
    @Param() uuid: string
  ) {
    const userUuid = request.user['userId'];
    const deleteGroupDto = new DeleteGroupDto(userUuid, uuid);

    try {
      await this.groupsService.remove(deleteGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':groupUuid/join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(202)
  async join(
    @Req() request: Request,
    @Param('groupUuid') groupUuid: string
  ): Promise<void> {
    const user = request.user['userId'];
    const joinGroupDto = new JoinGroupDto(user, groupUuid);

    try {
      await this.groupsService.join(joinGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':groupUuid/quit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(202)
  async quit(
    @Req() request: Request,
    @Param('groupUuid') groupUuid: string

  ): Promise<void> {
    const user = request.user['userId'];
    const dto = new QuitGroupDto(user, groupUuid);

    try {
      await this.groupsService.quit(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':groupUuid/icon')
  async getIcon(@Param('groupUuid') uuid: string, @Res() res): Promise<Observable<Object>> {
    return of(
      res.sendFile(
        `${process.cwd()}/${process.env.GROUP_STORAGE}${uuid}/icon.jpg`
      )
    )
  }

  @Get(':groupUuid/banner')
  async getBanner(@Param('groupUuid') uuid: string, @Res() res): Promise<Observable<Object>> {
    return of(
      res.sendFile(
        `${process.cwd()}/${process.env.GROUP_STORAGE}${uuid}/banner.jpg`
      )
    )
  }
}
