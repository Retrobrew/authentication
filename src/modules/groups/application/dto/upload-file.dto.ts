export class UploadFileDto {
  public readonly groupUuid: string;
  public readonly icon?: Buffer;
  public readonly banner?: Buffer;


  constructor(
    groupUuid: string,
    icon?: Buffer,
    banner?: Buffer
  ) {
    this.groupUuid = groupUuid;
    this.icon = icon;
    this.banner = banner;
  }
}