export class QuitGroupDto {
  userUuid: string;
  groupUuid: string;

  constructor(userUuid: string, groupUuid: string) {
    this.userUuid = userUuid;
    this.groupUuid = groupUuid;
  }
}
