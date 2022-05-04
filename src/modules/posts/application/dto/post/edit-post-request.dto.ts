import { IsDate, IsString } from 'class-validator';

export class EditPostRequestDto {
  @IsString()
  readonly changedTitle: string;

  @IsString()
  readonly changedContent: string;

  @IsDate()
  readonly dateOfUpdate: Date;
}