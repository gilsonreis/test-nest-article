import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from '../dto/input/login.dto';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginResponse } from '../dto/output/login.response';
import { RegisterDto } from '../dto/input/register.dto';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { RegisterResponse } from '../dto/output/register.response';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    const { accessToken } = await this.loginUseCase.execute(
      dto.email,
      dto.password,
    );
    return { accessToken };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    const res = await this.registerUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });
    return res;
  }
}
