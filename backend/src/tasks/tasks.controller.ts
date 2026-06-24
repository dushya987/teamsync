import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Get project tasks with filters and pagination' })
  @ApiParam({ name: 'projectId', example: 'project-id-here' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  })
  @ApiQuery({ name: 'assigneeId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['dueDate', 'priority'] })
  @ApiResponse({ status: 200, description: 'Tasks returned successfully.' })
  findProjectTasks(
    @Param('projectId') projectId: string,
    @Query() query: TaskQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.findProjectTasks(projectId, query, user);
  }

  @Post('projects/:projectId/tasks')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create task in a project' })
  @ApiParam({ name: 'projectId', example: 'project-id-here' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Only project managers or admins can create tasks.',
  })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(projectId, dto, user);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get task details with assignee and comments' })
  @ApiParam({ name: 'id', example: 'task-id-here' })
  @ApiResponse({ status: 200, description: 'Task returned successfully.' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.findOne(id, user);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', example: 'task-id-here' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, dto, user);
  }
}
