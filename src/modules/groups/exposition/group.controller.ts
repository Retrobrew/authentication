import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put, Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/authentication/jwt-auth-guard';
import { CreateGroupDto } from '../application/dto/create-group.dto';
import { GroupsService } from '../application/services/groups.service';
import { ModifyGroupDto } from '../application/dto/modify-group.dto';
import { Groups } from '../domain/entities/groups.entity';
import { Request } from 'express';
import { DeleteGroupDto } from '../application/dto/delete-group.dto';
import { JoinGroupDto } from '../application/dto/join-group.dto';
import { QuitGroupDto } from '../application/dto/quit-group.dto';

@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
@UseGuards(JwtAuthGuard)
@Controller('groups/')
export class GroupController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getALl(): Promise<Groups[]> {
    try {
      return await this.groupsService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':uuid')
  async get(@Param('uuid') uuid: string): Promise<Groups> {
    try {
      return await this.groupsService.find(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @HttpCode(202)
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request
  ) {
    createGroupDto.userUuid= req.user['userId'];

    try {
      return await this.groupsService.create(createGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  @HttpCode(202)
  async update(@Body() modifyGroupDto: ModifyGroupDto) {
    try {
      await this.groupsService.modify(modifyGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':uuid')
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

  // Join/quit group

  @Post('/join')
  @HttpCode(202)
  async join(@Body() request: JoinGroupDto): Promise<void> {
    try {
      await this.groupsService.join(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/quit')
  @HttpCode(202)
  async quit(@Body() request: QuitGroupDto): Promise<void> {
    try {
      await this.groupsService.quit(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
