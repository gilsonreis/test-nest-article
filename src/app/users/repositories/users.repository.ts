import type { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(
    data: Pick<UserEntity, 'name' | 'email' | 'password' | 'role'>,
  ): Promise<UserEntity>;
}
