import { Inject, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from '../repositories/users.repository';
import type { UsersRepository } from '../repositories/users.repository';

export class DeleteUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.usersRepo.findById(id);
    if (!existing) throw new NotFoundException('Usuário não encontrado');
    await this.usersRepo.delete(id);
  }
}
