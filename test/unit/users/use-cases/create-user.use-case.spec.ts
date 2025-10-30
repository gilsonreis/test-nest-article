import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../../../../src/app/users/use-cases/create-user.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lança ConflictException se e-mail já existe', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue({ id: 1 } as any),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };

    const sut = new CreateUserUseCase(repo);
    await expect(
      sut.execute({ name: 'A', email: 'a@example.com', password: '123456' }),
    ).rejects.toThrow(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('cria usuário com senha hasheada e role padrão reader', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'A',
        email: 'a@example.com',
        role: 'reader',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed' as any);

    const sut = new CreateUserUseCase(repo);
    const res = await sut.execute({ name: 'A', email: 'a@example.com', password: '123456' });

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(repo.create).toHaveBeenCalledWith({
      name: 'A',
      email: 'a@example.com',
      password: 'hashed',
      role: 'reader',
    });
    expect(res.role).toBe('reader');
    expect(res.email).toBe('a@example.com');
  });
});