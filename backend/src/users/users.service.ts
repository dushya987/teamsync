import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    email: string;
    name: string;
    passwordHash: string;
    role: UserRole;
  }) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
