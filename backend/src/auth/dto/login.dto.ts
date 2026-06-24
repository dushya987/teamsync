import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@teamsync.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password!: string;
}
