import { UserDto } from '../../../users/application/dto/friend/user.dto';

export class GroupHomeDto {
  public readonly uuid: string;
  public readonly name: string;
  public readonly picture: string;
  public readonly description: string;
  public readonly isProject: boolean;
  public readonly createdBy: UserDto;
  public readonly language: string;
  public readonly members: UserDto[];

  constructor(
    uuid: string,
    name: string,
    picture: string,
    description: string,
    isProject: boolean,
    createdBy: UserDto,
    language: string,
    members: UserDto[]
  ) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.description = description;
    this.isProject = isProject;
    this.createdBy = createdBy;
    this.language = language;
    this.members = members;
  }
}