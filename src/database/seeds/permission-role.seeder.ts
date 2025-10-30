import { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

export default class PermissionRoleSeeder implements Seeder {
  async run(ds: DataSource): Promise<void> {
    const roles: Array<{ id: number; name: string }> = await ds.query(
      `SELECT id, name FROM roles`,
    );
    const perms: Array<{ id: number; permission: string }> = await ds.query(
      `SELECT id, permission FROM permissions`,
    );

    const roleId = (n: string) => roles.find((r) => r.name === n)?.id;
    const permId = (p: string) => perms.find((x) => x.permission === p)?.id;

    const admin = roleId('admin');
    const editor = roleId('editor');
    const reader = roleId('reader');

    const pCreate = permId('articles:create');
    const pRead = permId('articles:read');
    const pUpdate = permId('articles:update');
    const pDelete = permId('articles:delete');
    const pReadByUser = permId('articles:read_by_user');

    const pairs: Array<[number, number]> = [];
    if (admin != null) {
      for (const pid of [pCreate, pRead, pUpdate, pDelete, pReadByUser]) {
        if (pid != null) pairs.push([pid, admin]);
      }
    }
    if (editor != null) {
      for (const pid of [pCreate, pRead, pUpdate, pReadByUser]) {
        if (pid != null) pairs.push([pid, editor]);
      }
    }
    if (reader != null) {
      for (const pid of [pRead, pReadByUser]) {
        if (pid != null) pairs.push([pid, reader]);
      }
    }

    for (const [permission_id, role_id] of pairs) {
      await ds.query(
        `INSERT IGNORE INTO permissions_role (permission_id, role_id) VALUES (?, ?)`,
        [permission_id, role_id],
      );
    }
  }
}
