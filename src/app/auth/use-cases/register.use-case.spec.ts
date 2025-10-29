/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from './register.use-case';
import type { UsersRepository } from '../../users/repositories/users.repository';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/app/users/entities/user.entity';

describe('RegisterUseCase', () => {
  const makeRepo = (existing?: any): UsersRepository => ({
    findByEmail: jest.fn().mockResolvedValue(existing ?? null),
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

  it('deve falhar em e-mail duplicado', async () => {
    const repo = makeRepo({ id: 10, email: 'a@b.c' });
    const usecase = new RegisterUseCase(repo);

    await expect(
      usecase.execute({ name: 'A', email: 'a@b.c', password: '123456' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('deve criar usuário com senha hasheada', async () => {
    const repo = makeRepo(undefined);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed!');
    (repo.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'João',
      email: 'joao@example.com',
      role: 'reader',
    });

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
