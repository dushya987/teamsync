import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get projects for authenticated user' })
  @ApiResponse({ status: 200, description: 'Projects returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMyProjects(@CurrentUser() user: any) {
    return this.projectsService.findUserProjects(user.id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Only admins and managers can create projects.',
  })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(dto, user);
  }
}
