import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  // @IsNotEmpty()
  // @Transform(({ value }: TransformFnParams) => value.trim())
  icon: Buffer;

  banner: Buffer;

  description: string;

  @IsNotEmpty()
  isProject: string;

  language: string;

  userUuid: string;

}
