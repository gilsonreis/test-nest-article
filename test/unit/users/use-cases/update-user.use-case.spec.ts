import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from '../../../../src/app/users/use-cases/update-user.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UpdateUserUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lança NotFoundException quando não existe', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };

    const sut = new UpdateUserUseCase(repo);
    await expect(sut.execute(1, { name: 'X' })).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando email novo já está em uso', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue({ id: 1, email: 'old@example.com' } as any),
      findByEmail: jest.fn().mockResolvedValue({ id: 2, email: 'new@example.com' } as any),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };

    const sut = new UpdateUserUseCase(repo);
    await expect(
      sut.execute(1, { email: 'new@example.com' }),
    ).rejects.toThrow(ConflictException);
  });

  it('hasheia a senha quando fornecida e atualiza', async () => {
    const now = new Date();
    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue({ id: 1, email: 'x@y.com' } as any),
      findByEmail: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'x@y.com',
        role: 'reader',
        createdAt: now,
        updatedAt: now,
      } as any),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed' as any);

    const sut = new UpdateUserUseCase(repo);
    const res = await sut.execute(1, { password: '123456', name: 'John' });

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(repo.update).toHaveBeenCalledWith(1, { password: 'hashed', name: 'John' });
    expect(res.name).toBe('John');
    expect(res.email).toBe('x@y.com');
  });
});