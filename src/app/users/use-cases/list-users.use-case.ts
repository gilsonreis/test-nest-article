import { Inject } from '@nestjs/common';
import { USERS_REPOSITORY } from '../repositories/users.repository';
import type { UsersRepository } from '../repositories/users.repository';
import type { ListUsersQueryDto } from '../dto/input/list-users.query.dto';
import type { ListUsersResponse } from '../dto/output/list-users.response';

export class ListUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async execute(query: ListUsersQueryDto): Promise<ListUsersResponse> {
    const page = Math.max(1, Number(query.page ?? 1));
    const perPage = Math.max(1, Number(query._perPage ?? 15));
    const search = query.search?.trim();

    const { items, total } = await this.usersRepo.findMany({
      search,
      page,
      perPage,
    });

    const data = items.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    return {
      data,
      meta: { page, perPage, total, totalPages },
    };
  }
}
