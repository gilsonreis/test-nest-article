import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TypeormUsersRepository } from './repositories/typeorm-users.repository';
import { USERS_REPOSITORY } from './repositories/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { ListUsersUseCase } from './use-cases/list-users.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { ListUsersAction } from './actions/list-users.action';
import { GetUserAction } from './actions/get-user.action';
import { CreateUserAction } from './actions/create-user.action';
import { UpdateUserAction } from './actions/update-user.action';
import { DeleteUserAction } from './actions/delete-user.action';

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
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    JwtAuthGuard,
  ],
  controllers: [
    ListUsersAction,
    GetUserAction,
    CreateUserAction,
    UpdateUserAction,
    DeleteUserAction,
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
