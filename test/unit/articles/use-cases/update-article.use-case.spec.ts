import { NotFoundException } from '@nestjs/common';
import { UpdateArticleUseCase } from '../../../../src/app/articles/use-cases/update-article.use-case';
import type { ArticlesRepository } from '../../../../src/app/articles/repositories/articles.repository';

describe('UpdateArticleUseCase', () => {
  it('lança NotFound quando não existe', async () => {
    const repo: jest.Mocked<ArticlesRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new UpdateArticleUseCase(repo);
    await expect(sut.execute(99, { title: 'X' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('atualiza e retorna com autor', async () => {
    const now = new Date();
    const repo: jest.Mocked<ArticlesRepository> = {
      findById: jest
        .fn()
        .mockResolvedValueOnce({ id: 1 } as any)
        .mockResolvedValueOnce({
          id: 1,
          title: 'New',
          content: 'C',
          userId: 9,
          createdAt: now,
          updatedAt: now,
          user: { id: 9, name: 'John', email: 'john@example.com', role: 'editor' } as any,
        } as any),
      update: jest.fn().mockResolvedValue({ id: 1 } as any),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    };

    const sut = new UpdateArticleUseCase(repo);
    const res = await sut.execute(1, { title: 'New' });

    expect(repo.update).toHaveBeenCalledWith(1, { title: 'New' });
    expect(repo.findById).toHaveBeenCalledTimes(2);
    expect(res.title).toBe('New');
    expect(res.author?.name).toBe('John');
  });
});