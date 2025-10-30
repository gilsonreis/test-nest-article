import { NotFoundException } from '@nestjs/common';
import { GetArticleUseCase } from '../../../../src/app/articles/use-cases/get-article.use-case';
import type { ArticlesRepository } from '../../../../src/app/articles/repositories/articles.repository';

describe('GetArticleUseCase', () => {
  it('lança NotFound quando não existe', async () => {
    const repo: jest.Mocked<ArticlesRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new GetArticleUseCase(repo);
    await expect(sut.execute(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('retorna ArticleResponse com autor', async () => {
    const now = new Date();
    const repo: jest.Mocked<ArticlesRepository> = {
      findById: jest.fn().mockResolvedValue({
        id: 1,
        title: 'T',
        content: 'C',
        userId: 9,
        createdAt: now,
        updatedAt: now,
        user: { id: 9, name: 'John', email: 'john@example.com', role: 'editor' } as any,
      } as any),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new GetArticleUseCase(repo);
    const res = await sut.execute(1);
    expect(res.title).toBe('T');
    expect(res.author?.email).toBe('john@example.com');
  });
});