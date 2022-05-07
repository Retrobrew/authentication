import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Groups } from 'src/modules/groups/domain/entities/groups.entity';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { ModifyGroupDto } from '../dto/modify-group.dto';
import { GroupsMembership } from '../../domain/entities/groups_membership.entity';
import { JoinGroupDto, RequestGroup } from '../dto/join-group.dto';
import { QuitGroupDto } from '../dto/quit-group.dto';
import { User } from '../../../users/domain/entities/user.entity';

export interface UserAndGroup {
  user: User;
  group: Groups;
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups)
    private readonly groupsRepository: EntityRepository<Groups>,
    @InjectRepository(GroupsMembership)
    private readonly groupMembership: EntityRepository<GroupsMembership>,
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

  async join(request: JoinGroupDto): Promise<void> {
    const result = await this._RequestValid({
      groupUuid: request.groupUuid,
      userUuid: request.userUuid,
    });

    const groupMembership = new GroupsMembership(
      randomUUID(),
      result.user,
      result.group,
      new Date(),
    );

    await this.groupMembership.persistAndFlush(groupMembership);
  }

  async quit(request: QuitGroupDto): Promise<void> {
    const result = await this._RequestValid({
      groupUuid: request.groupUuid,
      userUuid: request.userUuid,
    });

    const groupMembership = new GroupsMembership(
      randomUUID(),
      result.user,
      result.group,
      new Date(),
    );

    await this.groupMembership.removeAndFlush(groupMembership);
  }

  private async _RequestValid(request: RequestGroup): Promise<UserAndGroup> {
    // TODO : Autorisation + recupérer directement le user via token
    const user = await this.userService.findOneByUuid(request.userUuid);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const group = await this.find(request.groupUuid);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return <UserAndGroup>{
      user,
      group,
    };
  }
}
