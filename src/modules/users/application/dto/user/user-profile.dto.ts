export class UserProfileDto {
  public readonly uuid: string;
  public readonly username: string;
  public readonly picture: string;
  public readonly sex: string;
  public readonly country: string;
  public readonly dateOfBirth: Date;
  public readonly friendshipStatus?: string;

  constructor(
    uuid: string,
    username: string,
    picture: string,
    sex: string,
    country: string,
    dateOfBirth: Date,
    friendshipStatus?: string
  ) {
    this.uuid = uuid;
    this.username = username;
    this.picture = picture;
    this.sex = sex;
    this.country = country;
    this.dateOfBirth = dateOfBirth;
    this.friendshipStatus = friendshipStatus;
  }
}