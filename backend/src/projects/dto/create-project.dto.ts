import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website Redesign' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Marketing website redesign project' })
  @IsString()
  @IsOptional()
  description?: string;
}
