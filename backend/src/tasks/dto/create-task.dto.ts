import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Build login screen' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Create responsive login page' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, example: TaskPriority.HIGH })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: 'user-id-here' })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({ example: '2026-06-30T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
