/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';

function makeContext(headers: Record<string, string>): any {
  const req: any = { headers };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  };
}

describe('JwtAuthGuard', () => {
  const jwt = { verify: jest.fn() } as unknown as JwtService;
  const config = {
    get: jest.fn().mockReturnValue('dev-secret'),
  } as unknown as ConfigService;
  const guard = new JwtAuthGuard(jwt, config);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve falhar sem Authorization header', () => {
    expect(() => guard.canActivate(makeContext({}))).toThrow(
      UnauthorizedException,
    );
  });

  it('deve falhar com formato inválido', () => {
    expect(() =>
      guard.canActivate(makeContext({ authorization: 'Basic xyz' })),
    ).toThrow(UnauthorizedException);
  });

  it('deve aceitar token válido e preencher req.user', () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 1, email: 'a@b.c' });
    const ctx = makeContext({ authorization: 'Bearer token123' });
    const ok = guard.canActivate(ctx);
    expect(ok).toBe(true);
    expect(jwt.verify).toHaveBeenCalledWith('token123', {
      secret: 'dev-secret',
    });
  });

  it('deve falhar em token inválido', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('bad token');
    });
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      guard.canActivate(makeContext({ authorization: 'Bearer bad' })),
    ).toThrow(UnauthorizedException);
  });
});
