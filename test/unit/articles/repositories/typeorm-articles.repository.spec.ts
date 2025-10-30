/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TypeormArticlesRepository } from '../../../../src/app/articles/repositories/typeorm-articles.repository';
import type { Repository } from 'typeorm';
import type { ArticleEntity } from '../../../../src/app/articles/entities/article.entity';

function makeQB() {
  const calls: any = {
    leftJoinAndSelect: [] as any[],
    where: [] as any[],
    orWhere: [] as any[],
    orderBy: [] as any[],
    skip: [] as any[],
    take: [] as any[],
  };
  const qb: any = {
    leftJoinAndSelect: (...args: any[]) => {
      calls.leftJoinAndSelect.push(args);
      return qb;
    },
    where: (...args: any[]) => {
      calls.where.push(args);
      return qb;
    },
    orWhere: (...args: any[]) => {
      calls.orWhere.push(args);
      return qb;
    },
    orderBy: (...args: any[]) => {
      calls.orderBy.push(args);
      return qb;
    },
    skip: (...args: any[]) => {
      calls.skip.push(args);
      return qb;
    },
    take: (...args: any[]) => {
      calls.take.push(args);
      return qb;
    },
    getManyAndCount: jest.fn().mockResolvedValue<[ArticleEntity[], number]>([[], 0]),
    getOne: jest.fn().mockResolvedValue(null),
    calls,
  };
  return qb;
}

describe('TypeormArticlesRepository.findMany', () => {
  it('faz leftJoinAndSelect com autor e aplica filtros de busca', async () => {
    const qb = makeQB();
    const repo = new TypeormArticlesRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as unknown as Repository<ArticleEntity>);

    await repo.findMany({ search: 'nest', page: 2, perPage: 5 });

    expect(qb.calls.leftJoinAndSelect[0]).toEqual(['a.user', 'u']);
    expect(qb.calls.where.some(([sql]) => sql.includes('a.title LIKE'))).toBe(true);
    expect(
      qb.calls.orWhere.some(([sql]) =>
        sql.includes('MATCH(a.content) AGAINST'),
      ),
    ).toBe(true);
    expect(qb.calls.skip[0][0]).toBe((2 - 1) * 5);
    expect(qb.calls.take[0][0]).toBe(5);

    // retorno
    qb.getManyAndCount.mockResolvedValueOnce([[{ id: 1 } as any], 1]);
    const res = await repo.findMany({ page: 1, perPage: 15 });
    expect(res.items).toHaveLength(1);
    expect(res.total).toBe(1);
  });
});

describe('TypeormArticlesRepository.findById', () => {
  it('faz leftJoinAndSelect e aplica where id', async () => {
    const qb = makeQB();
    qb.getOne.mockResolvedValueOnce({ id: 42 } as any);
    const repo = new TypeormArticlesRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as unknown as Repository<ArticleEntity>);

    const res = await repo.findById(42);
    expect(qb.calls.leftJoinAndSelect[0]).toEqual(['a.user', 'u']);
    expect(qb.calls.where[0][0]).toBe('a.id = :id');
    expect(res?.id).toBe(42);
  });
});