import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from '../dto/input/create-article.dto';
import { CreateArticleUseCase } from '../use-cases/create-article.use-case';
import { ArticleResponse } from '../dto/output/article.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';

@Controller('articles')
export class CreateArticleAction {
  constructor(private readonly useCase: CreateArticleUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('articles:create')
  async execute(@Body() dto: CreateArticleDto): Promise<ArticleResponse> {
    return this.useCase.execute({
      title: dto.title,
      content: dto.content,
      userId: dto.userId,
    });
  }
}
