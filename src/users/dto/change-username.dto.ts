import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class ChangeUsernameDto {
  uuid: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  username: string;
}