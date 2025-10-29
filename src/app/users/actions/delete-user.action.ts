import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller('users')
export class DeleteUserAction {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async execute(@Param('id') id: string): Promise<void> {
    await this.useCase.execute(Number(id));
  }
}
