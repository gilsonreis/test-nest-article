import { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  async run(ds: DataSource): Promise<void> {
    const email = 'admin@example.com';
    const existing: Array<{ id: number }> = await ds.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email],
    );
    if (existing.length > 0) {
      // já existe, idempotente
      return;
    }

    const hashed = await bcrypt.hash('secret123', 10);

    await ds.query(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Admin User', email, hashed, 'admin'],
    );
  }
}
