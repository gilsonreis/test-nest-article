import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from '../dto/input/update-user.dto';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UserResponse } from '../dto/output/user.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../commons/guards/permissions.guard';
import { RequirePermissions } from '../../commons/decorators/require-permissions.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UpdateUserAction {
  constructor(private readonly useCase: UpdateUserUseCase) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users:update')
  async execute(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.useCase.execute(Number(id), dto);
  }
}
