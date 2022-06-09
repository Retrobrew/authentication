import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class EditCommentDto {

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly author: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly comment: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsDate()
  @IsNotEmpty()
  readonly updatedAt: Date;

  constructor(
    author: string,
    comment: string,
    content: string,
    updatedAt: Date
  ) {
    this.author    = author;
    this.comment   = comment;
    this.content   = content;
    this.updatedAt = updatedAt;
  }
}