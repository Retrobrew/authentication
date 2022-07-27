import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class FriendDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly username: string;

  public readonly picture: string;

  public readonly country: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly uuid: string;


  constructor(
    username: string,
    picture: string,
    country: string,
    uuid: string
  ) {
    this.username = username;
    this.picture = picture;
    this.country = country;
    this.uuid = uuid;
  }
}