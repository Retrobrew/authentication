export class FindUserDto {
  public readonly userUuid: string;
  public readonly userToFindUuid: string;


  constructor(
    userUuid: string,
    userToFindUuid: string
  ) {
    this.userUuid = userUuid;
    this.userToFindUuid = userToFindUuid;
  }
}