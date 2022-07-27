import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  icon?: Buffer;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  banner?: Buffer;

  description: string;

  @IsNotEmpty()
  isProject: string;

  language: string;

  userUuid: string;

}
