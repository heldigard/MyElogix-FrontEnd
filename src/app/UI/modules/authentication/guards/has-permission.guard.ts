import { CanActivateFn } from '@angular/router';
import { EPermission } from '../../../../users/domain/models/EPermission';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
import { inject } from '@angular/core';
import { isRoleAllowed } from './has-role.guard';

export const hasPermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationImplService);

  // Usar el computed signal directamente
  const user = authService.getCurrentUser();
  let allowed = false;

  if (user?.roles && route.data['permissions']) {
    allowed = isPermissionAllowed(user.roles, route.data['permissions']);
  }

  if (!allowed && user?.roles && route.data['roles']) {
    allowed = isRoleAllowed(user.roles, route.data['roles']);
  }

  // Si el usuario no está autorizado, redirigir al login
  if (!allowed) {
    authService.navigateToLogin();
  }

  return allowed;
};

const isPermissionAllowed = (
  userRoles: Set<string>,
  allowedPermissions: EPermission[],
): boolean => {
  return allowedPermissions.some((permission) => userRoles.has(permission));
};
