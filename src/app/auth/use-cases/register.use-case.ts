import { ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USERS_REPOSITORY } from '../../users/repositories/users.repository';
import type { UsersRepository } from '../../users/repositories/users.repository';

export class RegisterUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'editor' | 'reader';
  }): Promise<{
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'reader';
  }> {
    const existing = await this.usersRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashed = await bcrypt.hash(input.password, 10);
    const role = input.role ?? 'reader';
    const user = await this.usersRepo.create({
      name: input.name,
      email: input.email,
      password: hashed,
      role,
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
