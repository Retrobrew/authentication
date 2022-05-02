import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateGroupDto {
    @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  private readonly name: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  private readonly picture: string;

  @Transform(({ value }: TransformFnParams) => value.trim())
  private readonly description: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  private readonly isProject: boolean;
  
  constructor(name: string, picture: string, description : string, isProject: boolean) {
      this.name = name;
      this.picture = picture;
      this.description = description;
      this.isProject = isProject;
  }
    
}