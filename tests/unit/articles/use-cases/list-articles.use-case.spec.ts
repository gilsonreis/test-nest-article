import { ListArticlesUseCase } from '../../../../src/app/articles/use-cases/list-articles.use-case';
import type { ArticlesRepository } from '../../../../src/app/articles/repositories/articles.repository';

describe('ListArticlesUseCase', () => {
  it('lista artigos e mapeia autor, com paginação padrão', async () => {
    const now = new Date();
    const repo: jest.Mocked<ArticlesRepository> = {
      findMany: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            title: 'T',
            content: 'C',
            userId: 9,
            createdAt: now,
            updatedAt: now,
            user: { id: 9, name: 'John', email: 'john@example.com', role: 'editor' } as any,
          } as any,
        ],
        total: 1,
      }),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new ListArticlesUseCase(repo);
    const res = await sut.execute({} as any);

    expect(repo.findMany).toHaveBeenCalledWith({
      search: undefined,
      page: 1,
      perPage: 15,
    });
    expect(res.data[0].author?.name).toBe('John');
    expect(res.meta.total).toBe(1);
    expect(res.meta.totalPages).toBe(1);
  });

  it('passa search, page e perPage corretamente', async () => {
    const repo: jest.Mocked<ArticlesRepository> = {
      findMany: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const sut = new ListArticlesUseCase(repo);
    await sut.execute({ search: '  nest  ', page: 3, _perPage: 2 } as any);
    expect(repo.findMany).toHaveBeenCalledWith({
      search: 'nest',
      page: 3,
      perPage: 2,
    });
  });
});