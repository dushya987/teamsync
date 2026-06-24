import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MEMBER })
  @IsEnum(UserRole)
  role!: UserRole;
}
