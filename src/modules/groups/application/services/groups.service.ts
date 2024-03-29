import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import * as fs from 'fs';
import { UploadFileDto } from '../dto/upload-file.dto';
import { UploadIconDto } from '../dto/upload-icon.dto';
import { UserDto } from '../../../users/application/dto/friend/user.dto';
import { FindGroupDto } from '../dto/find-group.dto';
import { GroupHomeDto } from '../dto/group-home.dto';

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
      picture: Groups.ICON_FILE_NAME,
      banner: Groups.BANNER_FILE_NAME,
      createdAt: new Date(),
      description: request.description,
      isProject: request.isProject !== 'false',
      createdBy: user,
      language: request.language,
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

  async findAll(): Promise<FindGroupDto[]> {
    const groupDtos = [];
    const groups = await this.groupsRepository.find(
      { uuid : { $ne: 'home' } },
      // @ts-ignore
      { fields: ['uuid', 'name', 'createdBy',{createdBy: ['uuid']}, 'picture', 'language'] }
    );

    groups.forEach(group => {
      const creator = group.getCreator();
      groupDtos.push(new FindGroupDto(
        group.getUuid(),
        group.getName(),
        group.getPicture(),
        new UserDto(
          creator.getUuid(),
          creator.getUsername(),
          creator.getPicture()
        ),
        group.getLanguage()
      ))
    });

    return groupDtos;
  }

  async find(uuid: string): Promise<Groups> {
    return await this.groupsRepository.findOne(
      { uuid: uuid },
      // @ts-ignore
      { fields: ['uuid', 'name', 'isProject', 'createdBy',{createdBy: ['uuid', 'username', 'picture']}, 'members', 'picture', 'description', 'language'] }
    );
  }

  async getGroup(uuid: string): Promise<GroupHomeDto> {
    const group = await this.find(uuid);
    const creator = group.getCreator();
    const creatorDto = new UserDto(
      creator.getUuid(),
      creator.getUsername(),
      creator.getPicture()
    );

    const membersDto = [];
    group.getMembers().forEach(member => {
      membersDto.push(new UserDto(
        member.getUuid(),
        member.getUsername(),
        member.getPicture()
      ));
    })
    return new GroupHomeDto(
      group.getUuid(),
      group.getName(),
      group.getPicture(),
      group.getDescription(),
      group.isProject,
      creatorDto,
      group.getLanguage(),
      membersDto
    )
  }

  async getUserGroups(userUuid: string): Promise<Array<UserProfileGroupDto>> {
    const user: User = await this.userService.findOneByUuid(userUuid);

    if(!user){
      throw new BadRequestException("User unknown");
    }
    const groups: Array<UserProfileGroupDto> = [];

    const groupAsMember: Array<GroupsMembership> = await this.groupMembership.find(
      { user: user, },
      { fields: [
          // @ts-ignore
          'id', 'group', { group: ['name', 'uuid', 'createdBy', {createdBy: ['uuid']}] }
        ]
      });

    groupAsMember.forEach((membership) => {
      const dto = new UserProfileGroupDto(
        membership.getGroup().uuid,
        membership.getGroup().getName(),
        false,
        new UserDto(
          membership.getGroup().getCreator().getUuid(),
          membership.getGroup().getCreator().getUsername(),
        )
      );
      groups.push(dto);
    });

    const groupAsCreator: Array<Groups> = await this.groupsRepository.find(
      {
        createdBy: user,
        uuid : { $ne: 'home' }
      },
      // @ts-ignore
      { fields: ['name', 'uuid', 'createdBy', {createdBy: ['uuid']}] }
      );

    groupAsCreator.forEach((group) => {
      const dto = new UserProfileGroupDto(
        group.uuid,
        group.getName(),
        true,
        new UserDto(
          group.getCreator().getUuid(),
          group.getCreator().getUsername(),
        )
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

  async uploadImage(uploadFileDto: UploadIconDto) {
    const result = await this._RequestValid({
      groupUuid: uploadFileDto.groupUuid,
      userUuid: uploadFileDto.userUuid,
    });

    const isMember = result.group.getMembers().includes(result.user);
    const isCreator = result.group.getCreator().getUuid() == result.user.getUuid();
    if(!isMember && !isCreator){
      throw new UnauthorizedException("Operation not permitted. You need to be a member of this group")
    }

    const groupStorage = `${process.env.GROUP_STORAGE}${uploadFileDto.groupUuid}`;
    const iconFile     = groupStorage + '/' + Groups.ICON_FILE_NAME;
    this.writeFile(iconFile, uploadFileDto.file);
  }

  async uploadImagesOnGroupCreation(uploadFileDto: UploadFileDto) {
    const groupStorage = `${process.env.GROUP_STORAGE}${uploadFileDto.groupUuid}`;
    const iconFile     = groupStorage + '/' + Groups.ICON_FILE_NAME;
    const bannerFile   = groupStorage + '/' + Groups.BANNER_FILE_NAME;

    if(!fs.existsSync(groupStorage)){
      fs.mkdirSync(groupStorage, { recursive: true })
      this.copyFile(
        `${process.cwd()}/src/assets/${Groups.ICON_FILE_NAME}`,
        iconFile
      );
      this.copyFile(
        `${process.cwd()}/src/assets/${Groups.BANNER_FILE_NAME}`,
        bannerFile
      )
    }

    if(uploadFileDto.icon) {
      this.writeFile(iconFile, uploadFileDto.icon);
    }

    if(uploadFileDto.banner){
      this.writeFile(bannerFile, uploadFileDto.banner);
    }
  }


  private copyFile(path: string, dest: string) {
    fs.copyFile(
      path, dest,
      (err) => {
        console.log(err);
      })
  }

  private writeFile(filepath: string, file: Buffer) {
    fs.writeFile(filepath, file, function(err){
      console.log(err);
    });
  }

  private async _RequestValid(request: RequestGroup): Promise<UserAndGroup> {
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
