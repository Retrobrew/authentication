import { UserDto } from '../../../users/application/dto/friend/user.dto';

export class FindGroupDto {
  public readonly uuid: string;
  public readonly name: string;
  public readonly picture: string;
  public readonly createdBy: UserDto;
  public readonly language: string;

  constructor(
    uuid: string,
    name: string,
    picture: string,
    createdBy: UserDto,
    language: string,
  ) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.createdBy = createdBy;
    this.language = language;
  }
}