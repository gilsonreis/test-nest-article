import { Inject } from '@nestjs/common';
import { ARTICLES_REPOSITORY } from '../repositories/articles.repository';
import type { ArticlesRepository } from '../repositories/articles.repository';
import type { ArticleResponse } from '../dto/output/article.response';

export class CreateArticleUseCase {
  constructor(
    @Inject(ARTICLES_REPOSITORY)
    private readonly articlesRepo: ArticlesRepository,
  ) {}

  async execute(input: {
    title: string;
    content: string;
    userId: number;
  }): Promise<ArticleResponse> {
    const created = await this.articlesRepo.create({
      title: input.title,
      content: input.content,
      userId: input.userId,
    });
    const a = await this.articlesRepo.findById(created.id);

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
