export class AuthorDto {
  public readonly uuid: string;
  public readonly username: string;
  public readonly picture: string;
  public readonly country: string;

  constructor(
    uuid: string,
    username: string,
    country: string,
    picture: string = null
  ) {
    this.uuid = uuid;
    this.username = username;
    this.country = country;
    this.picture = picture;
  }
}