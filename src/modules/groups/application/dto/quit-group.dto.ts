import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { RequestGroup } from './join-group.dto';

export class QuitGroupDto {
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
