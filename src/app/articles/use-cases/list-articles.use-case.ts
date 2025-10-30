import { Inject } from '@nestjs/common';
import { ARTICLES_REPOSITORY } from '../repositories/articles.repository';
import type { ArticlesRepository } from '../repositories/articles.repository';
import type { ListArticlesQueryDto } from '../dto/input/list-articles.query.dto';
import type { ListArticlesResponse } from '../dto/output/list-articles.response';

export class ListArticlesUseCase {
  constructor(
    @Inject(ARTICLES_REPOSITORY)
    private readonly articlesRepo: ArticlesRepository,
  ) {}

  async execute(query: ListArticlesQueryDto): Promise<ListArticlesResponse> {
    const page = Math.max(1, Number(query.page ?? 1));
    const perPage = Math.max(1, Number(query._perPage ?? 15));
    const search = query.search?.trim();

    const { items, total } = await this.articlesRepo.findMany({
      search,
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
