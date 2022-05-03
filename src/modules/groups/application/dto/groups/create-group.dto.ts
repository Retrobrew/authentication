import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/domain/entities/user.entity";

export class CreateGroupDto {
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    name: string;

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    picture: string;

    @Transform(({ value }: TransformFnParams) => value.trim())
    description: string;

    @IsNotEmpty()
    isProject: boolean;

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    userUuid: string;
    
    constructor(name: string, picture: string, description : string, isProject: boolean, userUuid: string) {
        this.name = name;
        this.picture = picture;
        this.description = description;
        this.isProject = isProject;
        this.userUuid = userUuid;
    }

}