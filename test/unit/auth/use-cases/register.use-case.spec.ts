/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from '../../../../src/app/auth/use-cases/register.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('RegisterUseCase', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve falhar em e-mail duplicado', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue({ id: 10, email: 'a@b.c' } as any),
      create: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const usecase = new RegisterUseCase(repo);

    await expect(
      usecase.execute({ name: 'A', email: 'a@b.c', password: '123456' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('deve criar usuário com senha hasheada e role reader por padrão', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'João',
        email: 'joao@example.com',
        role: 'reader',
      } as any),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed!');

    const usecase = new RegisterUseCase(repo);
    const res = await usecase.execute({
      name: 'João',
      email: 'joao@example.com',
      password: 'secret123',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
    expect(repo.create).toHaveBeenCalledWith({
      name: 'João',
      email: 'joao@example.com',
      password: 'hashed!',
      role: 'reader',
    });
    expect(res).toEqual({
      id: 1,
      name: 'João',
      email: 'joao@example.com',
      role: 'reader',
    });
  });
});