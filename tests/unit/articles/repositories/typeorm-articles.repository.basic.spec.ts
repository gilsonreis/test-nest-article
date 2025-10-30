import { TypeormArticlesRepository } from '../../../../src/app/articles/repositories/typeorm-articles.repository';
import type { Repository } from 'typeorm';
import type { ArticleEntity } from '../../../../src/app/articles/entities/article.entity';

describe('TypeormArticlesRepository - métodos básicos', () => {
  function makeRepoMock() {
    return {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
    } as unknown as Repository<ArticleEntity>;
  }

  it('create usa repo.create e repo.save', async () => {
    const repoMock = makeRepoMock();
    const entity = { id: 1 } as any;
    (repoMock.create as any).mockReturnValue(entity);
    (repoMock.save as any).mockResolvedValue({ ...entity, title: 'T' });
    const sut = new TypeormArticlesRepository(repoMock);

    const res = await sut.create({
      title: 'T',
      content: 'C',
      userId: 9,
    });

    expect(repoMock.create).toHaveBeenCalledWith({
      title: 'T',
      content: 'C',
      userId: 9,
    });
    expect(repoMock.save).toHaveBeenCalledWith(entity);
    expect(res.title).toBe('T');
  });

  it('update lança erro se artigo não existe', async () => {
    const repoMock = makeRepoMock();
    (repoMock.findOne as any).mockResolvedValue(null);
    const sut = new TypeormArticlesRepository(repoMock);

    await expect(sut.update(10, { title: 'New' })).rejects.toThrow(
      'Article not found',
    );
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
  });

  it('update mescla e salva quando existe', async () => {
    const repoMock = makeRepoMock();
    const existing = { id: 5, title: 'Old' } as any;
    (repoMock.findOne as any).mockResolvedValue(existing);
    const merged = { id: 5, title: 'New' } as any;
    (repoMock.merge as any).mockReturnValue(merged);
    (repoMock.save as any).mockResolvedValue(merged);
    const sut = new TypeormArticlesRepository(repoMock);

    const res = await sut.update(5, { title: 'New' });
    expect(repoMock.merge).toHaveBeenCalledWith(existing, { title: 'New' });
    expect(repoMock.save).toHaveBeenCalledWith(merged);
    expect(res.title).toBe('New');
  });

  it('delete chama repo.delete', async () => {
    const repoMock = makeRepoMock();
    (repoMock.delete as any).mockResolvedValue(undefined);
    const sut = new TypeormArticlesRepository(repoMock);

    await sut.delete(7);
    expect(repoMock.delete).toHaveBeenCalledWith(7);
  });
});