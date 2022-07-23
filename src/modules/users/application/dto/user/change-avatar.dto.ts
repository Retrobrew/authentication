export class ChangeAvatarDto {
  public readonly userUuid: string;
  public readonly file: Buffer;


  constructor(userUuid: string, file: Buffer) {
    this.userUuid = userUuid;
    this.file = file;
  }
}