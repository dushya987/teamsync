import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole, UserRole, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findProjectTasks(projectId: string, query: TaskQueryDto, user: any) {
    await this.ensureProjectAccess(projectId, user.id);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.assigneeId && { assigneeId: query.assigneeId }),
    };

    const orderBy =
      query.sortBy === 'priority'
        ? { priority: 'desc' as const }
        : { dueDate: 'asc' as const };

    const [items, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async create(projectId: string, dto: CreateTaskDto, user: any) {
    await this.ensureProjectManagerOrAdmin(projectId, user);

    return this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async findOne(taskId: string, user: any) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    await this.ensureProjectAccess(task.projectId, user.id);

    return task;
  }

  async update(taskId: string, dto: UpdateTaskDto, user: any) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException('Task not found');

    await this.ensureTaskUpdateAllowed(task.projectId, task.assigneeId, user);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  private async ensureProjectAccess(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) throw new NotFoundException('Project not found');

    return member;
  }

  private async ensureProjectManagerOrAdmin(projectId: string, user: any) {
    if (user.role === UserRole.ADMIN) return;

    const member = await this.ensureProjectAccess(projectId, user.id);

    if (member.role !== ProjectRole.MANAGER) {
      throw new ForbiddenException('Only project managers can create tasks');
    }
  }

  private async ensureTaskUpdateAllowed(
    projectId: string,
    assigneeId: string | null,
    user: any,
  ) {
    if (user.role === UserRole.ADMIN) return;
    if (assigneeId === user.id) return;

    const member = await this.ensureProjectAccess(projectId, user.id);

    if (member.role !== ProjectRole.MANAGER) {
      throw new ForbiddenException('You are not allowed to update this task');
    }
  }
}
