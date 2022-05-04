import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CommentPostRequestDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;
}