import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePostRequestDto {
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;
}