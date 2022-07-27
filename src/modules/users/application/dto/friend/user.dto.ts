import { User } from '../../../domain/entities/user.entity';

export class UserDto {
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

  public static createFromUser(user: User): UserDto {
    return new UserDto(
      user.getUuid(),
      user.getUsername(),
      user.getPicture()
    );
  }
}