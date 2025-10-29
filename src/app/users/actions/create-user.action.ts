import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/input/create-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { UserResponse } from '../dto/output/user.response';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller('users')
export class CreateUserAction {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async execute(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return this.useCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });
  }
}
