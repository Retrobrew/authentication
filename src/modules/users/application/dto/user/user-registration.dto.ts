import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class UserRegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsString()
  username: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsString()
  dateOfBirth: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsString()
  sexe: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsString()
  country: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: "User's avatar as uploaded file",
  })
  avatar?: Buffer;


}
