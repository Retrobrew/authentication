export class UserDto {
  public readonly uuid: string;
  public readonly username: string;
  public readonly picture: string;
  //doubi

  constructor(
    uuid: string,
    username: string,
    picture: string = null
  ) {
    this.uuid = uuid;
    this.username = username;
    this.picture = picture;
  }
}