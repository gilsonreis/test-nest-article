import type { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(
    data: Pick<UserEntity, 'name' | 'email' | 'password' | 'role'>,
  ): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity | null>;
  update(
    id: number,
    changes: Partial<Pick<UserEntity, 'name' | 'email' | 'password' | 'role'>>,
  ): Promise<UserEntity>;
  delete(id: number): Promise<void>;
  findMany(params: {
    search?: string;
    page: number;
    perPage: number;
  }): Promise<{ items: UserEntity[]; total: number }>;
}
