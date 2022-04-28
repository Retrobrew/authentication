import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {

  uuid: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}