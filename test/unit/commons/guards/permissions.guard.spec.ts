import { ForbiddenException } from '@nestjs/common';
import { PermissionsGuard } from '../../../../src/app/commons/guards/permissions.guard';

function makeContext(user: any): any {
  const req: any = { user };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => ({}),
    getClass: () => ({}),
  };
}

describe('PermissionsGuard', () => {
  it('libera quando não há metadados de permissões', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as any;
    const guard = new PermissionsGuard(reflector);
    const ok = guard.canActivate(makeContext({ role: 'reader' }));
    expect(ok).toBe(true);
  });

  it('permite admin com permissões de users e articles', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(['articles:create', 'users:delete']),
    } as any;
    const guard = new PermissionsGuard(reflector);
    const ok = guard.canActivate(makeContext({ role: 'admin' }));
    expect(ok).toBe(true);
  });

  it('permite editor para artigos mas bloqueia users:delete', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['users:delete']),
    } as any;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(makeContext({ role: 'editor' }))).toThrow(
      ForbiddenException,
    );
  });

  it('permite reader para leitura de artigos por usuário', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['articles:read_by_user']),
    } as any;
    const guard = new PermissionsGuard(reflector);
    const ok = guard.canActivate(makeContext({ role: 'reader' }));
    expect(ok).toBe(true);
  });

  it('bloqueia quando req.user.role está ausente', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['articles:read']),
    } as any;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(makeContext({}))).toThrow(
      ForbiddenException,
    );
  });
});
