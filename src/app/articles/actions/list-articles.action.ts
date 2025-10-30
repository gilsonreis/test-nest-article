import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListArticlesUseCase } from '../use-cases/list-articles.use-case';
import { ListArticlesQueryDto } from '../dto/input/list-articles.query.dto';
import { ListArticlesResponse } from '../dto/output/list-articles.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';

@Controller('articles')
export class ListArticlesAction {
  constructor(private readonly useCase: ListArticlesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('articles:read')
  async execute(
    @Query() query: ListArticlesQueryDto,
  ): Promise<ListArticlesResponse> {
    return this.useCase.execute(query);
  }
}
