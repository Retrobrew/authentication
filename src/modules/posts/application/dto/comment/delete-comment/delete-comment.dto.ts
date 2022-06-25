import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DeleteCommentDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly userId: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly commentId: string;

  constructor(
    userId: string,
    commentId: string
  ) {
    this.userId    = userId;
    this.commentId = commentId;
  }
}