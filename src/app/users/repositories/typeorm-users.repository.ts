import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from './users.repository';

export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(
    data: Pick<UserEntity, 'name' | 'email' | 'password' | 'role'>,
  ): Promise<UserEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
