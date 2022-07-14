import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Groups } from 'src/modules/groups/domain/entities/groups.entity';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { ModifyGroupDto } from '../dto/modify-group.dto';
import { User } from '../../../users/domain/entities/user.entity';
import { DeleteGroupDto } from '../dto/delete-group.dto';
import { GroupsMembership } from '../../domain/entities/groups-membership.entity';
import { JoinGroupDto, RequestGroup } from '../dto/join-group.dto';
import { QuitGroupDto } from '../dto/quit-group.dto';
import { UserProfileGroupDto } from '../dto/user-profile-group.dto';

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
    private readonly userService: UsersService
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

    await this.groupsRepository.nativeUpdate({ uuid: request.uuid }, request);
    await this.groupsRepository.flush();
  }

  async remove(deleteGroupDto: DeleteGroupDto): Promise<void> {
    const user: User = await this.userService.findOneByUuid(deleteGroupDto.userUuid);

    if(!user){
      throw new BadRequestException("User unknown");
    }
    const group = await this.groupsRepository.findOne(deleteGroupDto.groupUuid, {populate: true});

    if(group.getCreator() !== user) {
      throw new ForbiddenException("Operation denied");
    }

    await this.groupsRepository.removeAndFlush(group);
  }

  async findAll(): Promise<Groups[]> {
    return await this.groupsRepository.findAll();
  }

  async find(uuid: string): Promise<Groups> {
    return await this.groupsRepository.findOne(
      { uuid: uuid },
      // @ts-ignore
      { fields: ['uuid', 'name', 'isProject', 'createdBy',{createdBy: ['uuid', 'username', 'picture']}, 'members', 'picture', 'description'] }
    );
  }

  async getUserGroups(userUuid: string): Promise<Array<UserProfileGroupDto>> {
    const user: User = await this.userService.findOneByUuid(userUuid);

    if(!user){
      throw new BadRequestException("User unknown");
    }
    const groups: Array<UserProfileGroupDto> = [];

    const groupAsMember: Array<GroupsMembership> = await this.groupMembership.find(
      { user: user },
      { fields: [
          // @ts-ignore
          'id', 'group', { group: ['name', 'uuid'] }
        ]
      });

    groupAsMember.forEach((membership) => {
      const dto = new UserProfileGroupDto(
        membership.getGroup().uuid,
        membership.getGroup().getName(),
        false
      );
      groups.push(dto);
    });

    const groupAsCreator: Array<Groups> = await this.groupsRepository.find(
      // @ts-ignore
      { createdBy: user },
      { fields: ['name', 'uuid'] }
      );

    groupAsCreator.forEach((group) => {
      const dto = new UserProfileGroupDto(
        group.uuid,
        group.getName(),
        true
      );
      groups.push(dto);
    })

    return groups;
  }

  async join(request: JoinGroupDto): Promise<void> {
    const result = await this._RequestValid({
      groupUuid: request.groupUuid,
      userUuid: request.userUuid,
    });

    const membership = await this.groupMembership.findOne({ user: result.user, group: result.group });

    if(membership){
      throw new BadRequestException("User is already a member of this group");
    }

    const groupMembership = new GroupsMembership(
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

    const groupMembership = await this.groupMembership.findOne(
      { group: result.group, user: result.user }
    );

    if(!groupMembership){
      throw new BadRequestException("User is not part of this group")
    }

    await this.groupMembership.removeAndFlush(groupMembership);
  }

  private async _RequestValid(request: RequestGroup): Promise<UserAndGroup> {
    // TODO : Autorisation
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
