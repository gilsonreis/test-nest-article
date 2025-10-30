import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';
import { ListUserArticlesUseCase } from '../use-cases/list-user-articles.use-case';
import type { ListArticlesResponse } from '../dto/output/list-articles.response';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User') // antes estava 'Users'
@ApiBearerAuth()
export class GetUserArticlesAction {
  constructor(private readonly useCase: ListUserArticlesUseCase) {}

  @Get(':userId/articles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('articles:read_by_user')
  async execute(
    @Param('userId') userId: string,
    @Query() query: { page?: number; _perPage?: number },
  ): Promise<ListArticlesResponse> {
    return this.useCase.execute(Number(userId), query);
  }
}
