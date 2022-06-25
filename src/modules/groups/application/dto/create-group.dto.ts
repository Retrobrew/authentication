import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  // @IsNotEmpty()
  // @Transform(({ value }: TransformFnParams) => value.trim())
  picture: string;

  description: string;

  @IsNotEmpty()
  isProject: boolean;

  userUuid: string;

  constructor(
    name: string,
    picture: string,
    description: string,
    isProject: boolean,
    userUuid: string,
  ) {
    this.name = name;
    this.picture = picture;
    this.description = description;
    this.isProject = isProject;
    this.userUuid = userUuid;
  }
}
