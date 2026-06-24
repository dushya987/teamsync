import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function mockContext(user: any): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(mockContext({ role: UserRole.MEMBER }))).toBe(
      true,
    );
  });

  it('allows access when user role matches required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(mockContext({ role: UserRole.ADMIN }))).toBe(true);
  });

  it('denies access when user role does not match required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(mockContext({ role: UserRole.MEMBER }))).toBe(
      false,
    );
  });
});
