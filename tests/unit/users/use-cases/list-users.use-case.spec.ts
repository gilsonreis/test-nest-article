/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ListUsersUseCase } from '../../../../src/app/users/use-cases/list-users.use-case';
import type { UsersRepository } from '../../../../src/app/users/repositories/users.repository';

describe('ListUsersUseCase', () => {
  it('normaliza paginação e repassa search para o repositório', async () => {
    const repo: jest.Mocked<UsersRepository> = {
      findMany: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
      }),
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new ListUsersUseCase(repo);
    await sut.execute({
      page: -1 as any,
      _perPage: undefined,
      search: '  admin  ',
    } as any);

    expect(repo.findMany).toHaveBeenCalledWith({
      search: 'admin',
      page: 1,
      perPage: 15,
    });
  });

  it('mapeia itens e calcula meta.totalPages corretamente', async () => {
    const now = new Date();
    const repo: jest.Mocked<UsersRepository> = {
      findMany: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            name: 'A',
            email: 'a@example.com',
            role: 'reader',
            createdAt: now,
            updatedAt: now,
          } as any,
          {
            id: 2,
            name: 'B',
            email: 'b@example.com',
            role: 'editor',
            createdAt: now,
            updatedAt: now,
          } as any,
        ],
        total: 25,
      }),
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new ListUsersUseCase(repo);
    const res = await sut.execute({ page: 2, _perPage: 10 });

    expect(res.data).toHaveLength(2);
    expect(res.meta.total).toBe(25);
    expect(res.meta.totalPages).toBe(3);
    expect((res.data[0] as any).password).toBeUndefined();
  });
});