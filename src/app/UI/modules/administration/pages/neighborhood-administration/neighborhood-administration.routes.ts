import { Routes } from '@angular/router';
import {
  ROLES_MANAGER,
  URL_ADMIN_NEIGHBORHOODS_EXCEL,
  URL_ADMIN_NEIGHBORHOODS_MAIN,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const NEIGHBORHOOD_ADMINISTRATIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./neighborhood-administration.component').then(
        (m) => m.NeighborhoodAdministrationComponent,
      ),
    children: [
      {
        path: URL_ADMIN_NEIGHBORHOODS_MAIN,
        loadComponent: () =>
          import('./pages/neighborhood-edit/neighborhood-edit.component').then(
            (m) => m.NeighborhoodEditComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 0,
          breadcrumb: { skip: true },
          permissions: [
            EPermission.ADMIN_READ,
            EPermission.ADMIN_ALL,
            EPermission.MANAGER_READ,
            EPermission.MANAGER_ALL,
            EPermission.COMMERCIAL_CREATE,
          ],
          roles: ROLES_MANAGER,
        },
      },
      {
        path: URL_ADMIN_NEIGHBORHOODS_EXCEL,
        loadComponent: () =>
          import(
            './pages/neighborhood-excel/neighborhood-excel.component'
          ).then((m) => m.NeighborhoodExcelComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'excel neighborhoods',
          permissions: [
            EPermission.ADMIN_READ,
            EPermission.ADMIN_ALL,
            EPermission.MANAGER_READ,
            EPermission.MANAGER_ALL,
            EPermission.COMMERCIAL_CREATE,
          ],
          roles: ROLES_MANAGER,
        },
      },
      {
        path: '',
        redirectTo: URL_ADMIN_NEIGHBORHOODS_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
