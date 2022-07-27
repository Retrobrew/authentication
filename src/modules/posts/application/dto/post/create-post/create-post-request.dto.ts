import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostRequestDto {
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly content: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  readonly createdAt: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: "post's picture as uploaded file",
  })
  readonly media?: Buffer;

  readonly postedIn: string;
}