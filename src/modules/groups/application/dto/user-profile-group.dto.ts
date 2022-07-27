import { UserDto } from '../../../users/application/dto/friend/user.dto';

export class UserProfileGroupDto {
  public readonly uuid: string;
  public readonly name: string;
  public readonly creator: boolean;
  public readonly createdBy: UserDto;

  constructor(
    uuid: string,
    name: string,
    creator: boolean,
    createdBy: UserDto,
  ) {
    this.uuid = uuid;
    this.name = name;
    this.creator = creator;
    this.createdBy = createdBy;
  }
}