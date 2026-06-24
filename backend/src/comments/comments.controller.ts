import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':taskId/comments')
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.create(taskId, dto, user);
  }
}
