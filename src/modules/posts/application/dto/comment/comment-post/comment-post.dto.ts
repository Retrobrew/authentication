import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CommentPostDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly author: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly parent: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;


  constructor(
    author: string,
    parent: string,
    content: string,
    createdAt: Date
  ) {
    this.author    = author;
    this.parent    = parent;
    this.content   = content;
    this.createdAt = createdAt;
  }
}