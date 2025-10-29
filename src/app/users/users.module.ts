import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TypeormUsersRepository } from './repositories/typeorm-users.repository';
import { USERS_REPOSITORY } from './repositories/users.repository';
import { UsersController } from './actions/users.controller';
import { ListUsersUseCase } from './use-cases/list-users.use-case';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: TypeormUsersRepository,
    },
    ListUsersUseCase,
    JwtAuthGuard,
  ],
  controllers: [UsersController],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
