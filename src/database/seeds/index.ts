import 'reflect-metadata';
import dataSource from '../../commons/config/typeorm-data-source';
import { runSeeders } from 'typeorm-extension';
import PermissionSeeder from './permission.seeder';
import RoleSeeder from './role.seeder';
import PermissionRoleSeeder from './permission-role.seeder';
import UserSeeder from './user.seeder';

void (async () => {
  await dataSource.initialize();
  try {
    await runSeeders(dataSource, {
      seeds: [PermissionSeeder, RoleSeeder, PermissionRoleSeeder, UserSeeder],
    });
    console.log('Seeds concluídos.');
  } catch (err) {
    console.error('Falha no seed:', err);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
})();
