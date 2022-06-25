export class DeleteGroupDto {
  public readonly userUuid: string;
  public readonly groupUuid: string;


  constructor(
    userUuid: string,
    groupUuid: string
  ) {
    this.userUuid = userUuid;
    this.groupUuid = groupUuid;
  }
}