import { Inject, NotFoundException } from '@nestjs/common';
import { ARTICLES_REPOSITORY } from '../repositories/articles.repository';
import type { ArticlesRepository } from '../repositories/articles.repository';
import type { ArticleResponse } from '../dto/output/article.response';

export class UpdateArticleUseCase {
  constructor(
    @Inject(ARTICLES_REPOSITORY)
    private readonly articlesRepo: ArticlesRepository,
  ) {}

  async execute(
    id: number,
    changes: Partial<{ title: string; content: string; userId: number }>,
  ): Promise<ArticleResponse> {
    const existing = await this.articlesRepo.findById(id);
    if (!existing) throw new NotFoundException('Artigo não encontrado');

    const updated = await this.articlesRepo.update(id, changes);
    const a = await this.articlesRepo.findById(updated.id);

    return {
      id: a!.id,
      title: a!.title,
      content: a!.content,
      userId: a!.userId,
      createdAt: a!.createdAt,
      updatedAt: a!.updatedAt,
      author: {
        id: a!.user!.id,
        name: a!.user!.name,
        email: a!.user!.email,
        role: a!.user!.role,
      },
    };
  }
}
