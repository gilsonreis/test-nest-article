import { NotFoundException } from '@nestjs/common';
import { GetUserUseCase } from '../../../../src/app/users/use-cases/get-user.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';

describe('GetUserUseCase', () => {
  it('lança NotFoundException quando não existe', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };
    const sut = new GetUserUseCase(repo);

    await expect(sut.execute(123)).rejects.toThrow(NotFoundException);
  });

  it('retorna dados mapeados sem password', async () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      password: 'secret',
      role: 'editor',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue(user),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };

    const sut = new GetUserUseCase(repo);
    const res = await sut.execute(1);

    expect(res).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    expect((res as any).password).toBeUndefined();
  });
});