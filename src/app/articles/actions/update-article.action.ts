import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateArticleDto } from '../dto/input/update-article.dto';
import { UpdateArticleUseCase } from '../use-cases/update-article.use-case';
import { ArticleResponse } from '../dto/output/article.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';

@Controller('articles')
export class UpdateArticleAction {
  constructor(private readonly useCase: UpdateArticleUseCase) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('articles:update')
  async execute(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
  ): Promise<ArticleResponse> {
    return this.useCase.execute(Number(id), dto);
  }
}
