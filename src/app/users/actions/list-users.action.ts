import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListUsersUseCase } from '../use-cases/list-users.use-case';
import { ListUsersQueryDto } from '../dto/input/list-users.query.dto';
import { ListUsersResponse } from '../dto/output/list-users.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller('users')
export class ListUsersAction {
  constructor(private readonly useCase: ListUsersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async execute(@Query() query: ListUsersQueryDto): Promise<ListUsersResponse> {
    return this.useCase.execute(query);
  }
}
