/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionsRoleTable1761541037166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name ENUM('admin','editor','reader') NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await queryRunner.query(`
      CREATE TABLE permissions_role (
        permission_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (permission_id, role_id),
        CONSTRAINT fk_pr_permission FOREIGN KEY (permission_id)
          REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_pr_role FOREIGN KEY (role_id)
          REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS permissions_role;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
  }
}
