import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './app/users/users.module';
import { ArticlesModule } from './app/articles/articles.module';
import { AuthModule } from './app/auth/auth.module';
import { PermissionsModule } from './app/permissions/permissions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // REMOVIDO: TypeOrmModule.forRoot(typeormOptions()),
    UsersModule,
    ArticlesModule,
    AuthModule,
    PermissionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      cache: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<string>('DB_PORT') ?? 3306),
        username: config.get<string>('DB_USERNAME') ?? 'root',
        password: config.get<string>('DB_PASSWORD') ?? 'root',
        database: config.get<string>('DB_DATABASE') ?? 'articles_db',
        logging: true,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
