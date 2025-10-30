import { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

export default class ArticleSeeder implements Seeder {
  async run(ds: DataSource): Promise<void> {
    // Evita duplicar: se o primeiro título existir, considera já seedado
    const existing: Array<{ id: number }> = await ds.query(
      `SELECT id FROM articles WHERE title = ? LIMIT 1`,
      ['NestJS Fundamentals'],
    );
    if (existing.length > 0) {
      return;
    }

    // Obtém usuários determinísticos criados pelo UserSeeder
    const [editor] = await ds.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      ['editor@example.com'],
    );
    const [reader] = await ds.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      ['reader@example.com'],
    );
    const [admin] = await ds.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      ['admin@example.com'],
    );

    const owner1 = editor?.id ?? admin?.id;
    const owner2 = reader?.id ?? admin?.id;
    if (!owner1 || !owner2) {
      throw new Error('Nenhum usuário disponível para associar artigos.');
    }

    const articles: Array<{ title: string; content: string }> = [
      {
        title: 'NestJS Fundamentals',
        content:
          'Introdução ao NestJS, arquitetura modular, controllers, providers e injeção de dependências.',
      },
      {
        title: 'Advanced NestJS Patterns',
        content:
          'Padrões avançados com módulos, use cases, actions, guards JWT e design orientado a domínio.',
      },
      {
        title: 'TypeORM Tips for NestJS',
        content:
          'Dicas de TypeORM no NestJS: repositories, QueryBuilder, migrations e relacionamentos.',
      },
      {
        title: 'JWT Auth in NestJS',
        content:
          'Autenticação JWT com @nestjs/jwt, guards, Authorization Bearer token e melhores práticas.',
      },
      {
        title: 'Testing NestJS with Jest',
        content:
          'Testes unitários e e2e com Jest, mocks, spies e boas práticas para cobertura de código.',
      },
      {
        title: 'MySQL FULLTEXT Search',
        content:
          'Como usar MATCH AGAINST no MySQL para FULLTEXT em content, combinado com LIKE em title.',
      },
      {
        title: 'Dockerizing a NestJS App',
        content:
          'Dockerfile e docker-compose para desenvolvimento com MySQL, variáveis de ambiente e hot reload.',
      },
      {
        title: 'E2E Testing Setup',
        content:
          'Configuração de testes end-to-end, supertest, jest-e2e.json e verificação de rotas.',
      },
      {
        title: 'Configuration and Env Management',
        content:
          'Gerenciamento de configuração com @nestjs/config, .env, expandVariables e cache.',
      },
      {
        title: 'Performance Tuning in Node/Nest',
        content:
          'Boas práticas de performance, logs, indexes no banco e estratégias de paginação.',
      },
    ];

    const half = Math.ceil(articles.length / 2);
    for (let i = 0; i < articles.length; i++) {
      const ownerId = i < half ? owner1 : owner2;
      await ds.query(
        `INSERT INTO articles (title, content, user_id) VALUES (?, ?, ?)`,
        [articles[i].title, articles[i].content, ownerId],
      );
    }
  }
}
