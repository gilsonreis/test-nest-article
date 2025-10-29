import { TypeormUsersRepository } from '../../../../src/app/users/repositories/typeorm-users.repository';
import type { Repository } from 'typeorm';
import type { UserEntity } from '../../../../src/app/users/entities/user.entity';

describe('TypeormUsersRepository - métodos básicos', () => {
  function makeRepoMock() {
    return {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
    } as unknown as Repository<UserEntity>;
  }

  it('findByEmail chama repo.findOne com where: { email }', async () => {
    const repoMock = makeRepoMock();
    (repoMock.findOne as any).mockResolvedValue({ id: 1 });
    const sut = new TypeormUsersRepository(repoMock);

    const res = await sut.findByEmail('x@y.com');
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'x@y.com' },
    });
    expect(res).toEqual({ id: 1 });
  });

  it('create usa repo.create e repo.save', async () => {
    const repoMock = makeRepoMock();
    const entity = { id: 1 } as any;
    (repoMock.create as any).mockReturnValue(entity);
    (repoMock.save as any).mockResolvedValue({ ...entity, name: 'John' });
    const sut = new TypeormUsersRepository(repoMock);

    const res = await sut.create({
      name: 'John',
      email: 'john@example.com',
      password: 'hashed',
      role: 'reader',
    });

    expect(repoMock.create).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
      password: 'hashed',
      role: 'reader',
    });
    expect(repoMock.save).toHaveBeenCalledWith(entity);
    expect(res.name).toBe('John');
  });

  it('findById chama repo.findOne com where: { id }', async () => {
    const repoMock = makeRepoMock();
    (repoMock.findOne as any).mockResolvedValue({ id: 123 });
    const sut = new TypeormUsersRepository(repoMock);

    const res = await sut.findById(123);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 123 } });
    expect(res?.id).toBe(123);
  });

  it('update lança erro se usuário não existe', async () => {
    const repoMock = makeRepoMock();
    (repoMock.findOne as any).mockResolvedValue(null);
    const sut = new TypeormUsersRepository(repoMock);

    await expect(sut.update(10, { name: 'New' })).rejects.toThrow(
      'User not found',
    );
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
  });

  it('update mescla e salva quando existe', async () => {
    const repoMock = makeRepoMock();
    const existing = { id: 5, name: 'Old' } as any;
    (repoMock.findOne as any).mockResolvedValue(existing);
    const merged = { id: 5, name: 'New' } as any;
    (repoMock.merge as any).mockReturnValue(merged);
    (repoMock.save as any).mockResolvedValue(merged);
    const sut = new TypeormUsersRepository(repoMock);

    const res = await sut.update(5, { name: 'New' });
    expect(repoMock.merge).toHaveBeenCalledWith(existing, { name: 'New' });
    expect(repoMock.save).toHaveBeenCalledWith(merged);
    expect(res.name).toBe('New');
  });

  it('delete chama repo.delete', async () => {
    const repoMock = makeRepoMock();
    (repoMock.delete as any).mockResolvedValue(undefined);
    const sut = new TypeormUsersRepository(repoMock);

    await sut.delete(7);
    expect(repoMock.delete).toHaveBeenCalledWith(7);
  });
});
