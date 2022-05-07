import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export interface RequestGroup {
  userUuid: string;
  groupUuid: string;
}

export class JoinGroupDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  userUuid: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  groupUuid: string;

  constructor(requestGroup: RequestGroup) {
    this.userUuid = requestGroup.userUuid;
    this.groupUuid = requestGroup.groupUuid;
  }
}
