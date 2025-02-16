import { CanActivateFn } from '@angular/router';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
import { inject } from '@angular/core';
import { ERole } from '../../../../users/domain/models/ERole';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationImplService);

  // Usar el computed signal directamente
  const user = authService.getCurrentUser();

  if (!user?.roles || !route.data['roles']) {
    authService.navigateToLogin();
    return false;
  }

  const allowed = isRoleAllowed(user.roles, route.data['roles']);

  if (!allowed) {
    authService.navigateToLogin();
  }

  return allowed;
};

export const isRoleAllowed = (
  userRoles: Set<string>,
  allowedRoles: ERole[],
): boolean => {
  return allowedRoles.some((allowedRole) => userRoles.has(allowedRole));
};
