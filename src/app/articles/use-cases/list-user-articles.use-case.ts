import { Inject } from '@nestjs/common';
import { ARTICLES_REPOSITORY } from '../repositories/articles.repository';
import type { ArticlesRepository } from '../repositories/articles.repository';
import type { ListArticlesResponse } from '../dto/output/list-articles.response';

export class ListUserArticlesUseCase {
  constructor(
    @Inject(ARTICLES_REPOSITORY)
    private readonly articlesRepo: ArticlesRepository,
  ) {}

  async execute(
    userId: number,
    query: { page?: number; _perPage?: number },
  ): Promise<ListArticlesResponse> {
    const page = Math.max(1, Number(query.page ?? 1));
    const perPage = Math.max(1, Number(query._perPage ?? 15));

    const { items, total } = await this.articlesRepo.findManyByUser({
      userId,
      page,
      perPage,
    });

    const data = items.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      userId: a.userId,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      author: {
        id: a.user!.id,
        name: a.user!.name,
        email: a.user!.email,
        role: a.user!.role,
      },
    }));

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    return {
      data,
      meta: { page, perPage, total, totalPages },
    };
  }
}