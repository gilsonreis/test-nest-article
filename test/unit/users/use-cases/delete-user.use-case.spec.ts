import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from '../../../../src/app/users/use-cases/delete-user.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';

describe('DeleteUserUseCase', () => {
  it('lança NotFoundException quando não existe', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    };

    const sut = new DeleteUserUseCase(repo);
    await expect(sut.execute(5)).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('chama delete quando existe', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findById: jest.fn().mockResolvedValue({ id: 5 } as any),
      delete: jest.fn().mockResolvedValue(undefined),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    };

    const sut = new DeleteUserUseCase(repo);
    await sut.execute(5);
    expect(repo.delete).toHaveBeenCalledWith(5);
  });
});