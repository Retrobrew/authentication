import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UserLink {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly username: string;
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly userlink: string;


  constructor(
    username: string,
    userlink: string
  ) {
    this.username = username;
    this.userlink = userlink;
  }
}