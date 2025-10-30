/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../../../src/app/auth/use-cases/login.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginUseCase', () => {
  const jwt = { signAsync: jest.fn() } as unknown as JwtService;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar accessToken quando credenciais são válidas', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        password: 'hashed',
        role: 'admin',
      } as any),
      create: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.signAsync as jest.Mock).mockResolvedValue('jwt-token');

    const usecase = new LoginUseCase(repo, jwt);
    const res = await usecase.execute('admin@example.com', 'secret123');

    expect(res.accessToken).toBe('jwt-token');
    expect(repo.findByEmail).toHaveBeenCalledWith('admin@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('secret123', 'hashed');
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'admin@example.com',
      role: 'admin',
    });
  });

  it('deve falhar quando usuário não existe', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const usecase = new LoginUseCase(repo, jwt);

    await expect(usecase.execute('x@example.com', 'x')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('deve falhar quando senha é inválida', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        password: 'h',
        role: 'admin',
      } as any),
      create: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const usecase = new LoginUseCase(repo, jwt);

    await expect(
      usecase.execute('admin@example.com', 'bad'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});