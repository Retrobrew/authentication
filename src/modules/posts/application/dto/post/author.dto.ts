export class AuthorDto {
  public readonly uuid: string;
  public readonly username: string;

  constructor(
    uuid: string,
    username: string
  ) {
    this.uuid = uuid;
    this.username = username;
  }
}