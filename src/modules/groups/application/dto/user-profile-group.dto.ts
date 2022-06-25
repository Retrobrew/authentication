export class UserProfileGroupDto {
  public readonly groupUuid: string;
  public readonly groupName: string;
  public readonly creator: boolean;

  constructor(
    groupUuid: string,
    groupName: string,
    creator: boolean
  ) {
    this.groupUuid = groupUuid;
    this.groupName = groupName;
    this.creator = creator;
  }
}