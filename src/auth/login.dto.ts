import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'abc123' })
  @MinLength(6)
  password: string;
}