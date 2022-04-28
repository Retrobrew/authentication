import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RequestFriendshipDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly userUuid: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly futurFriendUuid: string;


  constructor(userUuid: string, futurFriendUuid: string) {
    this.userUuid = userUuid;
    this.futurFriendUuid = futurFriendUuid;
  }
}