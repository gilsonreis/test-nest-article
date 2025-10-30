import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetArticleUseCase } from '../use-cases/get-article.use-case';
import { ArticleResponse } from '../dto/output/article.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';

@Controller('articles')
export class GetArticleAction {
  constructor(private readonly useCase: GetArticleUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('articles:read')
  async execute(@Param('id') id: string): Promise<ArticleResponse> {
    return this.useCase.execute(Number(id));
  }
}
