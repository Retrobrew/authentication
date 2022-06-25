export interface RequestGroup {
  userUuid: string;
  groupUuid: string;
}

export class JoinGroupDto {
  public readonly userUuid: string;

  public readonly groupUuid: string;

  constructor(userUuid, groupUuid) {
    this.userUuid = userUuid;
    this.groupUuid = groupUuid;
  }
}
