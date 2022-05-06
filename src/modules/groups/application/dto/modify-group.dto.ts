import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class ModifyGroupDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  uuid: string;

  @Transform(({ value }: TransformFnParams) => value.trim())
  picture: string;

  @Transform(({ value }: TransformFnParams) => value.trim())
  description: string;

  constructor(uuid: string, picture: string, description: string) {
    this.uuid = uuid;
    this.picture = picture;
    this.description = description;
  }
}
