import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { UserResponse } from '../dto/output/user.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class GetUserAction {
  constructor(private readonly useCase: GetUserUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users:read')
  async execute(@Param('id') id: string): Promise<UserResponse> {
    return this.useCase.execute(Number(id));
  }
}
