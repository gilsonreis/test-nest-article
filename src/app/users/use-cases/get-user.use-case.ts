import { Inject, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from '../repositories/users.repository';
import type { UsersRepository } from '../repositories/users.repository';
import type { UserResponse } from '../dto/output/user.response';

export class GetUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async execute(id: number): Promise<UserResponse> {
    const u = await this.usersRepo.findById(id);
    if (!u) throw new NotFoundException('Usuário não encontrado');
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}
