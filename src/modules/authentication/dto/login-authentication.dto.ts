import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class LoginAuthenticationDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsString()
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}