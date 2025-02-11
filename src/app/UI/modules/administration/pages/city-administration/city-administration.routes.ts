import { Routes } from '@angular/router';
import {
  ROLES_MANAGER,
  URL_ADMIN_CITIES_EXCEL,
  URL_ADMIN_CITIES_MAIN,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const CITY_ADMINISTRATIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./city-administration.component').then(
        (m) => m.CityAdministrationComponent,
      ),
    children: [
      {
        path: URL_ADMIN_CITIES_MAIN,
        loadComponent: () =>
          import('./pages/city-edit/city-edit.component').then(
            (m) => m.CityEditComponent,
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
        path: URL_ADMIN_CITIES_EXCEL,
        loadComponent: () =>
          import('./pages/city-excel/city-excel.component').then(
            (m) => m.CityExcelComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'excel ciudades',
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
        redirectTo: URL_ADMIN_CITIES_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
