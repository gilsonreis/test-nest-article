import { ListUserArticlesUseCase } from '../../../../src/app/articles/use-cases/list-user-articles.use-case';
import type { ArticlesRepository } from '../../../../src/app/articles/repositories/articles.repository';

describe('ListUserArticlesUseCase', () => {
  it('lista artigos do usuário com paginação padrão e mapeia autor', async () => {
    const now = new Date();
    const repo: jest.Mocked<ArticlesRepository> = {
      findManyByUser: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            title: 'T',
            content: 'C',
            userId: 9,
            createdAt: now,
            updatedAt: now,
            user: {
              id: 9,
              name: 'John',
              email: 'john@example.com',
              role: 'editor',
            } as any,
          } as any,
        ],
        total: 1,
      }),
      findMany: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new ListUserArticlesUseCase(repo);
    const res = await sut.execute(9, {} as any);

    expect(repo.findManyByUser).toHaveBeenCalledWith({
      userId: 9,
      page: 1,
      perPage: 15,
    });
    expect(res.data[0].author?.name).toBe('John');
    expect(res.meta.total).toBe(1);
    expect(res.meta.totalPages).toBe(1);
  });

  it('normaliza page e perPage e repassa para o repositório', async () => {
    const repo: jest.Mocked<ArticlesRepository> = {
      findManyByUser: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      findMany: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const sut = new ListUserArticlesUseCase(repo);
    await sut.execute(7, { page: 3, _perPage: 2 } as any);

    expect(repo.findManyByUser).toHaveBeenCalledWith({
      userId: 7,
      page: 3,
      perPage: 2,
    });
  });
});