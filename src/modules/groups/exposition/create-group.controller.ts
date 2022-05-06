import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/authentication/jwt-auth-guard';
import { CreateGroupDto } from '../application/dto/groups/create-group.dto';
import { GroupsService } from '../application/services/groups/groups.service';

@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
@UseGuards(JwtAuthGuard)
@Controller('groups/')
export class CreateGroupController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @HttpCode(202)
  async create(@Body() createGroupDto: CreateGroupDto) {
    try {
      const group = await this.groupsService.create(createGroupDto);
      return group;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
