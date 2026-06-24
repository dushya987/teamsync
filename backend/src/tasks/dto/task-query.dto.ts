import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TaskQueryDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: 'user-id-here' })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ['dueDate', 'priority'] })
  @IsIn(['dueDate', 'priority'])
  @IsOptional()
  sortBy?: 'dueDate' | 'priority';
}
