import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USERS_REPOSITORY } from '../repositories/users.repository';
import type { UsersRepository } from '../repositories/users.repository';
import type { UserResponse } from '../dto/output/user.response';

export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async execute(
    id: number,
    input: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'admin' | 'editor' | 'reader';
    },
  ): Promise<UserResponse> {
    const existing = await this.usersRepo.findById(id);
    if (!existing) throw new NotFoundException('Usuário não encontrado');

    if (input.email && input.email !== existing.email) {
      const dup = await this.usersRepo.findByEmail(input.email);
      if (dup) throw new ConflictException('E-mail já cadastrado');
    }

    const changes: any = { ...input };
    if (input.password) {
      changes.password = await bcrypt.hash(input.password, 10);
    }

    const u = await this.usersRepo.update(id, changes);
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
