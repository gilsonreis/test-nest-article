/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TypeormUsersRepository } from '../../../../src/app/users/repositories/typeorm-users.repository';
import type { Repository } from 'typeorm';
import type { UserEntity } from '../../../../src/app/users/entities/user.entity';

function makeQB() {
  const calls: any = {
    where: [] as any[],
    orWhere: [] as any[],
    orderBy: [] as any[],
    skip: [] as any[],
    take: [] as any[],
  };
  const qb: any = {
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
    getManyAndCount: jest.fn().mockResolvedValue<[UserEntity[], number]>([[], 0]),
    calls,
  };
  return qb;
}

describe('TypeormUsersRepository.findMany', () => {
  it('usa igualdade para role conhecida e LIKE para outras buscas', async () => {
    const qb = makeQB();
    const repo = new TypeormUsersRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as unknown as Repository<UserEntity>);

    await repo.findMany({ search: 'admin', page: 1, perPage: 10 });
    expect(qb.calls.where[0][0]).toContain('u.name LIKE');
    expect(qb.calls.orWhere.some(([sql]) => sql === 'u.role = :role')).toBe(true);

    const qb2 = makeQB();
    const repo2 = new TypeormUsersRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb2),
    } as unknown as Repository<UserEntity>);
    await repo2.findMany({ search: 'joao', page: 2, perPage: 5 });

    expect(qb2.calls.orWhere.some(([sql]) => sql === 'u.role LIKE :q')).toBe(true);
    expect(qb2.calls.skip[0][0]).toBe((2 - 1) * 5);
    expect(qb2.calls.take[0][0]).toBe(5);
  });

  it('retorna items e total do getManyAndCount()', async () => {
    const qb = makeQB();
    qb.getManyAndCount.mockResolvedValueOnce([[{ id: 1 } as any], 1]);
    const repo = new TypeormUsersRepository({
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as unknown as Repository<UserEntity>);

    const res = await repo.findMany({ page: 1, perPage: 15 });
    expect(res.items).toHaveLength(1);
    expect(res.total).toBe(1);
  });
});