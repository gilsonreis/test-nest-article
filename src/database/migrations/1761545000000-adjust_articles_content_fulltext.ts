import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustArticlesContentFulltext1761545000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Opcional: ampliar para LONGTEXT (útil para artigos maiores)
    await queryRunner.query(`
      ALTER TABLE articles
      MODIFY content LONGTEXT NOT NULL
    `);

    // Adiciona índice FULLTEXT para MATCH AGAINST no content
    await queryRunner.query(`
      ALTER TABLE articles
      ADD FULLTEXT INDEX idx_articles_content (content)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE articles
      DROP INDEX idx_articles_content
    `);

    // Reverte para TEXT
    await queryRunner.query(`
      ALTER TABLE articles
      MODIFY content TEXT NOT NULL
    `);
  }
}
