import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class EditCommentRequestDto {

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsDate()
  @IsNotEmpty()
  readonly updatedAt: Date;
}