/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from './login.use-case';
import type { UsersRepository } from '../../users/repositories/users.repository';

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/app/users/entities/user.entity';

describe('LoginUseCase', () => {
  const jwt = { signAsync: jest.fn() } as unknown as JwtService;

  const makeRepo = (user?: any): UsersRepository => ({
    findByEmail: jest.fn().mockResolvedValue(user ?? null),
    create: jest.fn(),
    findMany: jest.fn(),
    findById: function (id: number): Promise<UserEntity | null> {
      throw new Error('Function not implemented.');
    },
    update: function (
      id: number,
      changes: Partial<
        Pick<UserEntity, 'name' | 'email' | 'password' | 'role'>
      >,
    ): Promise<UserEntity> {
      throw new Error('Function not implemented.');
    },
    delete: function (id: number): Promise<void> {
      throw new Error('Function not implemented.');
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar accessToken quando credenciais são válidas', async () => {
    const repo = makeRepo({
      id: 1,
      email: 'admin@example.com',
      password: 'hashed',
      role: 'admin',
    });
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
    const repo = makeRepo(undefined);
    const usecase = new LoginUseCase(repo, jwt);

    await expect(usecase.execute('x@example.com', 'x')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('deve falhar quando senha é inválida', async () => {
    const repo = makeRepo({
      id: 1,
      email: 'admin@example.com',
      password: 'h',
      role: 'admin',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const usecase = new LoginUseCase(repo, jwt);

    await expect(
      usecase.execute('admin@example.com', 'bad'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
