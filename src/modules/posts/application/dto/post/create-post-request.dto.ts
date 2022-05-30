import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePostRequestDto {
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly createdAt: string;

  readonly media: Buffer;

  readonly postedIn: string;
}