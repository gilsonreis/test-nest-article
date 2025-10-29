import { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  async run(ds: DataSource): Promise<void> {
    await ds.query(`
      INSERT INTO roles (name)
      VALUES ('admin'), ('editor'), ('reader')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
  }
}
