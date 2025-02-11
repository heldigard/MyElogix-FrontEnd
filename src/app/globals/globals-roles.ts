import { ERole } from '../users/domain/models/ERole';

export const ROLES_COMMERCIAL: string[] = [
  ERole.SUPER_ADMIN,
  ERole.ADMIN,
  ERole.GLOBAL_MANAGER,
  ERole.MANAGER_COMMERCIAL,
  ERole.USER_COMMERCIAL,
];

export const ROLES_PRODUCTION: string[] = [
  ERole.SUPER_ADMIN,
  ERole.ADMIN,
  ERole.GLOBAL_MANAGER,
  ERole.MANAGER_PRODUCTION,
  ERole.USER_PRODUCTION,
];

export const ROLES_DISPATCH: string[] = [
  ERole.SUPER_ADMIN,
  ERole.ADMIN,
  ERole.GLOBAL_MANAGER,
  ERole.MANAGER_DISPATCH,
  ERole.USER_DISPATCH,
];

export const ROLES_BILLING: string[] = [
  ERole.SUPER_ADMIN,
  ERole.ADMIN,
  ERole.GLOBAL_MANAGER,
  ERole.MANAGER_BILLING,
  ERole.USER_BILLING,
];

export const ROLES_MANAGER: string[] = [
  ERole.SUPER_ADMIN,
  ERole.ADMIN,
  ERole.GLOBAL_MANAGER,
  ERole.MANAGER_COMMERCIAL,
];

export const ROLES_ADMIN: string[] = [ERole.SUPER_ADMIN, ERole.ADMIN];
