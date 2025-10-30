import { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

export default class PermissionSeeder implements Seeder {
  async run(ds: DataSource): Promise<void> {
    await ds.query(`
      INSERT INTO permissions (permission)
      VALUES
        ('articles:create'),
        ('articles:read'),
        ('articles:update'),
        ('articles:delete'),
        ('articles:read_by_user')
      ON DUPLICATE KEY UPDATE permission = VALUES(permission)
    `);
  }
}
