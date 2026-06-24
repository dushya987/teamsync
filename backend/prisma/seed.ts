import {
  PrismaClient,
  ProjectRole,
  TaskPriority,
  TaskStatus,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@teamsync.com' },
    update: {},
    create: {
      email: 'admin@teamsync.com',
      name: 'Admin User',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@teamsync.com' },
    update: {},
    create: {
      email: 'member@teamsync.com',
      name: 'Member User',
      passwordHash,
      role: UserRole.MEMBER,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      name: 'TeamSync Launch',
      description: 'Initial launch project for TeamSync assessment',
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: ProjectRole.MANAGER },
          { userId: member.id, role: ProjectRole.MEMBER },
        ],
      },
    },
  });

  await prisma.task.deleteMany({
    where: { projectId: project.id },
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project.id,
        title: 'Build authentication flow',
        description: 'Register, login, refresh token and guards',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        assigneeId: admin.id,
        dueDate: new Date('2026-06-25'),
      },
      {
        projectId: project.id,
        title: 'Create project dashboard',
        description: 'Responsive web dashboard for project tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: admin.id,
        dueDate: new Date('2026-06-28'),
      },
      {
        projectId: project.id,
        title: 'Implement mobile task list',
        description: 'Expo task list with offline cache',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: member.id,
        dueDate: new Date('2026-06-30'),
      },
      {
        projectId: project.id,
        title: 'Write architecture document',
        description: 'AWS deployment and CI/CD explanation',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: admin.id,
        dueDate: new Date('2026-07-01'),
      },
      {
        projectId: project.id,
        title: 'Record walkthrough video',
        description: 'Backend, web, mobile and architecture narration',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        assigneeId: member.id,
        dueDate: new Date('2026-07-02'),
      },
    ],
  });

  console.log('Seed completed');
  console.log('Admin: admin@teamsync.com / password123');
  console.log('Member: member@teamsync.com / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
