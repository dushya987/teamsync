import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  const prismaMock = {
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    projectMember: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService(prismaMock as any);
  });

  it('applies filtering, pagination and dueDate sorting for project tasks', async () => {
    prismaMock.projectMember.findUnique.mockResolvedValue({
      projectId: 'project-1',
      userId: 'user-1',
      role: 'MEMBER',
    });

    prismaMock.task.findMany.mockResolvedValue([]);
    prismaMock.task.count.mockResolvedValue(0);

    await service.findProjectTasks(
      'project-1',
      {
        status: 'TODO' as any,
        priority: 'HIGH' as any,
        assigneeId: 'user-2',
        page: 2,
        limit: 5,
        sortBy: 'dueDate',
      },
      { id: 'user-1', role: 'MEMBER' },
    );

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        projectId: 'project-1',
        status: 'TODO',
        priority: 'HIGH',
        assigneeId: 'user-2',
      },
      skip: 5,
      take: 5,
      orderBy: { dueDate: 'asc' },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    expect(prismaMock.task.count).toHaveBeenCalledWith({
      where: {
        projectId: 'project-1',
        status: 'TODO',
        priority: 'HIGH',
        assigneeId: 'user-2',
      },
    });
  });
});
