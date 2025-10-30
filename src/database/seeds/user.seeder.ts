import { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  async run(ds: DataSource): Promise<void> {
    const hashed = await bcrypt.hash('secret123', 10);

    async function ensureUser(
      name: string,
      email: string,
      role: 'admin' | 'editor' | 'reader',
    ) {
      const existing: Array<{ id: number }> = await ds.query(
        `SELECT id FROM users WHERE email = ? LIMIT 1`,
        [email],
      );
      if (existing.length === 0) {
        await ds.query(
          `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
          [name, email, hashed, role],
        );
      }
    }

    await ensureUser('Admin User', 'admin@example.com', 'admin');
    await ensureUser('Editor User', 'editor@example.com', 'editor');
    await ensureUser('Reader User', 'reader@example.com', 'reader');
  }
}
