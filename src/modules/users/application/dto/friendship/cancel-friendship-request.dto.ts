import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CancelFriendshipRequestDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly userUuid: string

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  public readonly requestId: number


  constructor(
    userUuid: string,
    requestId: number
  ) {
    this.userUuid = userUuid;
    this.requestId = requestId;
  }
}