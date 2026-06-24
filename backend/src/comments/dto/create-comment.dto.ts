import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Started working on this task.' })
  @IsString()
  @IsNotEmpty()
  body!: string;
}
