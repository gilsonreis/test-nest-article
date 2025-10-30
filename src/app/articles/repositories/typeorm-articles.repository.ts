import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';
import type { ArticlesRepository } from './articles.repository';

@Injectable()
export class TypeormArticlesRepository implements ArticlesRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repo: Repository<ArticleEntity>,
  ) {}

  async create(
    data: Pick<ArticleEntity, 'title' | 'content' | 'userId'>,
  ): Promise<ArticleEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: number): Promise<ArticleEntity | null> {
    return this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'u')
      .where('a.id = :id', { id })
      .getOne();
  }

  async update(
    id: number,
    changes: Partial<Pick<ArticleEntity, 'title' | 'content' | 'userId'>>,
  ): Promise<ArticleEntity> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new Error('Article not found');
    }
    const merged = this.repo.merge(existing, changes);
    return this.repo.save(merged);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findMany(params: {
    search?: string;
    page: number;
    perPage: number;
  }): Promise<{ items: ArticleEntity[]; total: number }> {
    const qb = this.repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'u');

    if (params.search) {
      const q = `%${params.search}%`;
      qb.where('a.title LIKE :q', { q })
        .orWhere('MATCH(a.content) AGAINST (:m IN NATURAL LANGUAGE MODE)', {
          m: params.search,
        });
    }

    qb.orderBy('a.id', 'DESC')
      .skip((params.page - 1) * params.perPage)
      .take(params.perPage);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findManyByUser(params: {
    userId: number;
    page: number;
    perPage: number;
  }): Promise<{ items: ArticleEntity[]; total: number }> {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'u')
      .where('a.user_id = :userId', { userId: params.userId })
      .orderBy('a.id', 'DESC')
      .skip((params.page - 1) * params.perPage)
      .take(params.perPage);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
