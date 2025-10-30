import { Inject, NotFoundException } from '@nestjs/common';
import { ARTICLES_REPOSITORY } from '../repositories/articles.repository';
import type { ArticlesRepository } from '../repositories/articles.repository';

export class DeleteArticleUseCase {
  constructor(
    @Inject(ARTICLES_REPOSITORY)
    private readonly articlesRepo: ArticlesRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.articlesRepo.findById(id);
    if (!existing) throw new NotFoundException('Artigo não encontrado');
    await this.articlesRepo.delete(id);
  }
}
