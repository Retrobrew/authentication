export class UserProfileGroupDto {
  public readonly groupUuid: String;
  public readonly groupName: String;
  public readonly creator: boolean;

  constructor(
    groupUuid: String,
    groupName: String,
    creator: boolean
  ) {
    this.groupUuid = groupUuid;
    this.groupName = groupName;
    this.creator = creator;
  }
}