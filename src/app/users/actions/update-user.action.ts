import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from '../dto/input/update-user.dto';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UserResponse } from '../dto/output/user.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller('users')
export class UpdateUserAction {
  constructor(private readonly useCase: UpdateUserUseCase) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async execute(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.useCase.execute(Number(id), dto);
  }
}
