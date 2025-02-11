import { Routes } from '@angular/router';
import {
  ROLES_ADMIN,
  URL_ADMIN_USERS_EXCEL,
  URL_ADMIN_USERS_MAIN,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const USER_ADMINISTRATIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./user-administration.component').then(
        (m) => m.UserAdministrationComponent,
      ),
    children: [
      {
        path: URL_ADMIN_USERS_MAIN,
        loadComponent: () =>
          import('./pages/user-edit/user-edit.component').then(
            (m) => m.UserEditComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 0,
          breadcrumb: { skip: true },
          permissions: [
            EPermission.SUPER_ADMIN_READ,
            EPermission.SUPER_ADMIN_ALL,
            EPermission.ADMIN_READ,
            EPermission.ADMIN_ALL,
          ],
          roles: ROLES_ADMIN,
        },
      },
      {
        path: URL_ADMIN_USERS_EXCEL,
        loadComponent: () =>
          import('./pages/user-excel/user-excel.component').then(
            (m) => m.UserExcelComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'excel users',
          permissions: [
            EPermission.SUPER_ADMIN_READ,
            EPermission.SUPER_ADMIN_ALL,
            EPermission.ADMIN_READ,
            EPermission.ADMIN_ALL,
          ],
          roles: ROLES_ADMIN,
        },
      },
      {
        path: '',
        redirectTo: URL_ADMIN_USERS_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
