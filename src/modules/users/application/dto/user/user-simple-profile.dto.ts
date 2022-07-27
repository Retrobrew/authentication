export class UserSimpleProfileDto {
  public readonly uuid: string;
  public readonly email: string;
  public readonly username: string;
  public readonly dateOfBirth: Date;
  public readonly sexe: string;
  public readonly country: string;
  public readonly picture: string;


  constructor(
    uuid: string,
    email: string,
    username: string,
    dateOfBirth: Date,
    sexe: string,
    country: string,
    picture: string
  ) {
    this.uuid = uuid;
    this.email = email;
    this.username = username;
    this.dateOfBirth = dateOfBirth;
    this.sexe = sexe;
    this.country = country;
    this.picture = picture;
  }
}