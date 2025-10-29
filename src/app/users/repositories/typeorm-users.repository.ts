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

  async findById(id: number): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(
    id: number,
    changes: Partial<Pick<UserEntity, 'name' | 'email' | 'password' | 'role'>>,
  ): Promise<UserEntity> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      // O use-case deve tratar NotFound; aqui lançamos para evitar salvar inexistente
      throw new Error('User not found');
    }
    const merged = this.repo.merge(existing, changes);
    return this.repo.save(merged);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findMany(params: {
    search?: string;
    page: number;
    perPage: number;
  }): Promise<{ items: UserEntity[]; total: number }> {
    const qb = this.repo.createQueryBuilder('u');

    if (params.search) {
      const q = `%${params.search}%`;
      qb.where('u.name LIKE :q OR u.email LIKE :q', { q });

      const lowered = params.search.toLowerCase();
      if (['admin', 'editor', 'reader'].includes(lowered)) {
        qb.orWhere('u.role = :role', { role: lowered });
      } else {
        qb.orWhere('u.role LIKE :q', { q });
      }
    }

    qb.orderBy('u.id', 'DESC')
      .skip((params.page - 1) * params.perPage)
      .take(params.perPage);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
