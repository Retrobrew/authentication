import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class EditPostDto {
  @IsString()
  readonly changedTitle: string;

  @IsString()
  readonly changedContent: string;

  @IsDate()
  readonly dateOfUpdate: Date;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly authorId: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly postUuid: string;


  constructor(
    changedTitle: string,
    changedContent: string,
    dateOfUpdate: Date,
    authorId: string,
    postUuid: string
  ) {
    this.changedTitle   = changedTitle;
    this.changedContent = changedContent;
    this.dateOfUpdate   = dateOfUpdate;
    this.authorId       = authorId;
    this.postUuid       = postUuid;
  }
}