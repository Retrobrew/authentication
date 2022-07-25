import { UserDto } from '../../../users/application/dto/friend/user.dto';

export class UserProfileGroupDto {
  public readonly groupUuid: string;
  public readonly groupName: string;
  public readonly creator: boolean;
  public readonly createdBy: UserDto;

  constructor(
    groupUuid: string,
    groupName: string,
    creator: boolean,
    createdBy: UserDto,
  ) {
    this.groupUuid = groupUuid;
    this.groupName = groupName;
    this.creator = creator;
    this.createdBy = createdBy;
  }
}