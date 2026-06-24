import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user returned successfully.',
  })
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
