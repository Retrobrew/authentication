import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class ChangeIdentityDto {
  uuid: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  firstname: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  lastname: string;
}