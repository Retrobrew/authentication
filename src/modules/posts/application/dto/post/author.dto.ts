export class AuthorDto {
  public readonly uuid: string;
  public readonly username: string;
  public readonly picture: string;

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