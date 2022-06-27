import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  content: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  author: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  media: Buffer;

  postedIn: string;
}