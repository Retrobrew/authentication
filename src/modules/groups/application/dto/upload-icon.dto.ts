export class UploadIconDto {
  public readonly groupUuid: string;
  public readonly file: Buffer;
  public readonly userUuid: string;


  constructor(
    groupUuid: string,
    file: Buffer,
    userUuid: string
  ) {
    this.groupUuid = groupUuid;
    this.file = file;
    this.userUuid = userUuid;
  }
}