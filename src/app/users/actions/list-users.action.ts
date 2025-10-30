import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListUsersUseCase } from '../use-cases/list-users.use-case';
import { ListUsersQueryDto } from '../dto/input/list-users.query.dto';
import { ListUsersResponse } from '../dto/output/list-users.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';

@Controller('users')
export class ListUsersAction {
  constructor(private readonly useCase: ListUsersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users:read')
  async execute(@Query() query: ListUsersQueryDto): Promise<ListUsersResponse> {
    return this.useCase.execute(query);
  }
}
