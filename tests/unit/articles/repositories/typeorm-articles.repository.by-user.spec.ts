/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TypeormArticlesRepository } from '../../../../src/app/articles/repositories/typeorm-articles.repository';
import type { Repository } from 'typeorm';
import type { ArticleEntity } from '../../../../src/app/articles/entities/article.entity';

function makeQB() {
  const calls: any = {
    leftJoinAndSelect: [] as any[],
    where: [] as any[],
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
    getManyAndCount: jest
      .fn()
      .mockResolvedValue<[ArticleEntity[], number]>([[], 0]),
    calls,
  };
  return qb;
}

describe('TypeormArticlesRepository.findManyByUser', () => {
  it('aplica leftJoin, where por usuário e paginação', async () => {
    const qb = makeQB();
    const repo = new TypeormArticlesRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as unknown as Repository<ArticleEntity>);

    await repo.findManyByUser({ userId: 9, page: 2, perPage: 5 });

    expect(qb.calls.leftJoinAndSelect[0]).toEqual(['a.user', 'u']);
    expect(qb.calls.where[0][0]).toBe('a.user_id = :userId');
    expect(qb.calls.orderBy[0]).toEqual(['a.id', 'DESC']);
    expect(qb.calls.skip[0][0]).toBe((2 - 1) * 5);
    expect(qb.calls.take[0][0]).toBe(5);
  });

  it('retorna items e total de getManyAndCount()', async () => {
    const qb = makeQB();
    qb.getManyAndCount.mockResolvedValueOnce([[{ id: 1 } as any], 1]);
    const repo = new TypeormArticlesRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as unknown as Repository<ArticleEntity>);

    const res = await repo.findManyByUser({
      userId: 1,
      page: 1,
      perPage: 10,
    });
    expect(res.items).toHaveLength(1);
    expect(res.total).toBe(1);
  });
});