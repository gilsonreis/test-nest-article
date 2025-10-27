import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './app/users/users.module';
import { ArticlesModule } from './app/articles/articles.module';
import { AuthModule } from './app/auth/auth.module';
import { PermissionsModule } from './app/permissions/permissions.module';
import { typeormOptions } from './commons/config/typeorm-options';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormOptions()),
    UsersModule,
    ArticlesModule,
    AuthModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
