import { ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USERS_REPOSITORY } from '../repositories/users.repository';
import type { UsersRepository } from '../repositories/users.repository';
import type { UserResponse } from '../dto/output/user.response';

export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'editor' | 'reader';
  }): Promise<UserResponse> {
    const existing = await this.usersRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const hashed = await bcrypt.hash(input.password, 10);
    const role = input.role ?? 'reader';
    const u = await this.usersRepo.create({
      name: input.name,
      email: input.email,
      password: hashed,
      role,
    });
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
