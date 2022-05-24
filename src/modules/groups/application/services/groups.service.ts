import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Groups,
  IGroups,
} from 'src/modules/groups/domain/entities/groups.entity';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { ModifyGroupDto } from '../dto/modify-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups)
    private readonly groupsRepository: EntityRepository<Groups>,
    private readonly userService: UsersService,
  ) {}

  async create(request: CreateGroupDto): Promise<Groups> {
    const user = await this.userService.findOneByUuid(request.userUuid);

    const group = new Groups({
      uuid: randomUUID(),
      name: request.name,
      picture: request.picture,
      createdAt: new Date(),
      description: request.description,
      isProject: request.isProject,
      createdBy: user,
    });

    await this.groupsRepository.persistAndFlush(group);

    return group;
  }

  async modify(request: ModifyGroupDto): Promise<void> {
    const group = await this.groupsRepository.findOne({ uuid: request.uuid });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    console.log(group);

    await this.groupsRepository.nativeUpdate({ uuid: request.uuid }, request);
    await this.groupsRepository.flush();
  }

  async remove(groupUuid: string): Promise<void> {
    // TODO : autorisation
    const group = await this.groupsRepository.findOne(groupUuid);
    await this.groupsRepository.removeAndFlush(group);
  }

  async findAll(): Promise<Groups[]> {
    return await this.groupsRepository.findAll();
  }

  async find(uuid: string): Promise<Groups> {
    return await this.groupsRepository.findOne(uuid);
  }
}
