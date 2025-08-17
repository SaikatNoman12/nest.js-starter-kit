import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enums/role.enums';
import { ROLES_KEY } from 'src/constants/constants';

export const SetMetaRoles = (...roles: RolesEnum[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
