import { NotFoundException } from '@nestjs/common';
import { DeleteArticleUseCase } from '../../../../src/app/articles/use-cases/delete-article.use-case';
import type { ArticlesRepository } from '../../../../src/app/articles/repositories/articles.repository';

describe('DeleteArticleUseCase', () => {
  it('lança NotFound quando não existe', async () => {
    const repo: jest.Mocked<ArticlesRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    };
    const sut = new DeleteArticleUseCase(repo);
    await expect(sut.execute(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deleta quando existe', async () => {
    const repo: jest.Mocked<ArticlesRepository> = {
      findById: jest.fn().mockResolvedValue({ id: 1 } as any),
      delete: jest.fn().mockResolvedValue(undefined),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    };
    const sut = new DeleteArticleUseCase(repo);
    await sut.execute(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});