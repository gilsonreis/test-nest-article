import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class DeleteUserAction {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users:delete')
  @HttpCode(204)
  async execute(@Param('id') id: string): Promise<void> {
    await this.useCase.execute(Number(id));
  }
}
