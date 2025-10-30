import 'reflect-metadata';
import { GetUserArticlesAction } from '../../../../src/app/articles/actions/get-user-articles.action';
import { ListUserArticlesUseCase } from '../../../../src/app/articles/use-cases/list-user-articles.use-case';
import { REQUIRED_PERMISSIONS_METADATA } from '../../../../src/app/commons/decorators/require-permissions.decorator';

describe('GetUserArticlesAction', () => {
  it('chama use case com userId e query normalizados e retorna resposta', async () => {
    const now = new Date();
    const expected = {
      data: [
        {
          id: 1,
          title: 'T',
          content: 'C',
          userId: 9,
          createdAt: now,
          updatedAt: now,
          author: {
            id: 9,
            name: 'John',
            email: 'john@example.com',
            role: 'editor',
          },
        },
      ],
      meta: { page: 2, perPage: 5, total: 1, totalPages: 1 },
    };
    const useCase = {
      execute: jest.fn().mockResolvedValue(expected),
    } as unknown as ListUserArticlesUseCase;

    const sut = new GetUserArticlesAction(useCase);
    const res = await sut.execute('9', { page: 2, _perPage: 5 });

    expect(useCase.execute).toHaveBeenCalledWith(9, { page: 2, _perPage: 5 });
    expect(res).toEqual(expected);
  });

  it("expõe metadado de permissão 'articles:read_by_user' no método", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      GetUserArticlesAction.prototype,
      'execute',
    )!;
    const perms = Reflect.getMetadata(
      REQUIRED_PERMISSIONS_METADATA,
      descriptor.value,
    );
    expect(perms).toEqual(['articles:read_by_user']);
  });
});