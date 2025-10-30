import type { ArticleEntity } from '../entities/article.entity';

export const ARTICLES_REPOSITORY = 'ARTICLES_REPOSITORY';

export interface ArticlesRepository {
  findMany(params: {
    search?: string;
    page: number;
    perPage: number;
  }): Promise<{ items: ArticleEntity[]; total: number }>;

  create(
    data: Pick<ArticleEntity, 'title' | 'content' | 'userId'>,
  ): Promise<ArticleEntity>;

  findById(id: number): Promise<ArticleEntity | null>;

  update(
    id: number,
    changes: Partial<Pick<ArticleEntity, 'title' | 'content' | 'userId'>>,
  ): Promise<ArticleEntity>;

  delete(id: number): Promise<void>;

  findManyByUser(params: {
    userId: number;
    page: number;
    perPage: number;
  }): Promise<{ items: ArticleEntity[]; total: number }>;
}
