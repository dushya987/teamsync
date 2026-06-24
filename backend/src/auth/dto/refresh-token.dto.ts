import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-value' })
  @IsNotEmpty()
  refreshToken!: string;
}
