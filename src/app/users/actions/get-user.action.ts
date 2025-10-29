import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { UserResponse } from '../dto/output/user.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller('users')
export class GetUserAction {
  constructor(private readonly useCase: GetUserUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async execute(@Param('id') id: string): Promise<UserResponse> {
    return this.useCase.execute(Number(id));
  }
}
