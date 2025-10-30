import { CreateArticleUseCase } from '../../../../src/app/articles/use-cases/create-article.use-case';
import type { ArticlesRepository } from '../../../../src/app/articles/repositories/articles.repository';

describe('CreateArticleUseCase', () => {
  it('cria artigo e retorna com autor carregado', async () => {
    const now = new Date();
    const repo: jest.Mocked<ArticlesRepository> = {
      create: jest.fn().mockResolvedValue({ id: 1 } as any),
      findById: jest.fn().mockResolvedValue({
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
      } as any),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new CreateArticleUseCase(repo);
    const res = await sut.execute({ title: 'T', content: 'C', userId: 9 });

    expect(repo.create).toHaveBeenCalledWith({
      title: 'T',
      content: 'C',
      userId: 9,
    });
    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(res.author?.role).toBe('editor');
  });
});
