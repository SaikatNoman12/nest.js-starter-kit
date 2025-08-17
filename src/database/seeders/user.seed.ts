import { HashingProvider } from 'src/modules/auth/provider/hashing.provider';
import { User } from 'src/modules/user/user.entity';
import { RolesEnum } from 'src/shared/enums/role.enums';
import { DataSource } from 'typeorm';

export async function seedUserData(
  dataSource: DataSource,
  hashProvider: HashingProvider,
) {
  const hashedAdminPassword = await hashProvider.hashPassword('Admin123@');
  const repository = dataSource.getRepository(User);

  /**
   * only insert if not already present
   */
  const existingAdmin = await repository.findOne({
    where: { email: 'admin@gmail.com' },
  });
  if (!existingAdmin) {
    await repository.insert({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedAdminPassword,
      role: RolesEnum.ADMIN,
    });
  }
}
