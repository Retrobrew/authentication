import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/domain/entities/user.entity";

export class CreateGroupDto {
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    private readonly _name: string;

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    private readonly _picture: string;

    @Transform(({ value }: TransformFnParams) => value.trim())
    private readonly _description: string;

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    private readonly _isProject: boolean;

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    private readonly _createdBy: User;
    
    constructor(name: string, picture: string, description : string, isProject: boolean, createdBy: User) {
        this._name = name;
        this._picture = picture;
        this._description = description;
        this._isProject = isProject;
        this._createdBy = createdBy;
    }

    
    
}