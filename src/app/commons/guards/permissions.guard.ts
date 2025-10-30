import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSIONS_METADATA } from '../decorators/require-permissions.decorator';

type Role = 'admin' | 'editor' | 'reader';

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    'articles:create',
    'articles:read',
    'articles:update',
    'articles:delete',
    'articles:read_by_user',
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
  ],
  editor: [
    'articles:create',
    'articles:read',
    'articles:update',
    'articles:delete',
    'articles:read_by_user',
  ],
  reader: ['articles:read', 'articles:read_by_user'],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const required: string[] =
      this.reflector.getAllAndOverride<string[]>(
        REQUIRED_PERMISSIONS_METADATA,
        [ctx.getHandler(), ctx.getClass()],
      ) ?? [];

    // Sem permissões marcadas, libera
    if (required.length === 0) return true;

    const role: Role | undefined = req.user?.role;
    if (!role) {
      throw new ForbiddenException('Usuário sem papel definido');
    }

    const allowed = ROLE_PERMISSIONS[role] ?? [];
    const ok = required.every((perm) => allowed.includes(perm));

    if (!ok) {
      throw new ForbiddenException('Permissões insuficientes');
    }
    return true;
  }
}
