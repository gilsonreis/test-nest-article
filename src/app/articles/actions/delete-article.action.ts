import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { DeleteArticleUseCase } from '../use-cases/delete-article.use-case';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('articles')
@ApiTags('Article')
@ApiBearerAuth()
export class DeleteArticleAction {
  constructor(private readonly useCase: DeleteArticleUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('articles:delete')
  @HttpCode(204)
  async execute(@Param('id') id: string): Promise<void> {
    await this.useCase.execute(Number(id));
  }
}
