import { CanActivateFn } from '@angular/router';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
import { inject } from '@angular/core';

export const isLoggedInGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthenticationImplService);

  if (!authService.getIsLoggedIn()) {
    authService.navigateToLogin();
    return false;
  }

  return true;
};
