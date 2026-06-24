import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, ProjectRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateProjectDto, user: { id: string; role: UserRole }) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Only admins and managers can create projects',
      );
    }

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: ProjectRole.MANAGER,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async ensureProjectMember(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Project not found');
    }

    return membership;
  }
}
