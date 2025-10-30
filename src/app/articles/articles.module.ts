import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ArticleEntity } from './entities/article.entity';
import { ARTICLES_REPOSITORY } from './repositories/articles.repository';
import { TypeormArticlesRepository } from './repositories/typeorm-articles.repository';
import { ListArticlesUseCase } from './use-cases/list-articles.use-case';
import { GetArticleUseCase } from './use-cases/get-article.use-case';
import { CreateArticleUseCase } from './use-cases/create-article.use-case';
import { UpdateArticleUseCase } from './use-cases/update-article.use-case';
import { DeleteArticleUseCase } from './use-cases/delete-article.use-case';
import { ListArticlesAction } from './actions/list-articles.action';
import { GetArticleAction } from './actions/get-article.action';
import { CreateArticleAction } from './actions/create-article.action';
import { UpdateArticleAction } from './actions/update-article.action';
import { DeleteArticleAction } from './actions/delete-article.action';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { PermissionsGuard } from '../commons/guards/permissions.guard';
import { ListUserArticlesUseCase } from './use-cases/list-user-articles.use-case';
import { GetUserArticlesAction } from './actions/get-user-articles.action';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
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
      provide: ARTICLES_REPOSITORY,
      useClass: TypeormArticlesRepository,
    },
    ListArticlesUseCase,
    GetArticleUseCase,
    CreateArticleUseCase,
    UpdateArticleUseCase,
    DeleteArticleUseCase,
    ListUserArticlesUseCase,
    JwtAuthGuard,
    PermissionsGuard,
  ],
  controllers: [
    ListArticlesAction,
    GetArticleAction,
    CreateArticleAction,
    UpdateArticleAction,
    DeleteArticleAction,
    GetUserArticlesAction,
  ],
  exports: [ARTICLES_REPOSITORY],
})
export class ArticlesModule {}
