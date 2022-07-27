import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    name: 'access_token'
  })
  accessToken: string
}