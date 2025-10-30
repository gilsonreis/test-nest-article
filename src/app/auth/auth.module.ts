import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './actions/auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { UsersModule } from '../users/users.module';
import { RegisterUseCase } from './use-cases/register.use-case';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION') ?? '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, RegisterUseCase],
})
export class AuthModule {}
