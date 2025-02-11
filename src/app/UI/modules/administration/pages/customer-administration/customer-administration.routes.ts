import { Routes } from '@angular/router';
import {
  ROLES_MANAGER,
  URL_ADMIN_CLIENTS_EDIT,
  URL_ADMIN_CLIENTS_EXCEL,
  URL_ADMIN_CLIENTS_MAIN,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const CUSTOMER_ADMINISTRATIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./customer-administration.component').then(
        (m) => m.CustomerAdministrationComponent,
      ),
    children: [
      {
        path: URL_ADMIN_CLIENTS_MAIN,
        loadComponent: () =>
          import('./pages/customers/customers.component').then(
            (m) => m.CustomersComponent,
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
        path: URL_ADMIN_CLIENTS_EDIT,
        loadComponent: () =>
          import('./pages/customer-edit/customer-edit.component').then(
            (m) => m.CustomerEditComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'editar cliente',
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
        path: URL_ADMIN_CLIENTS_EXCEL,
        loadComponent: () =>
          import('./pages/customer-excel/customer-excel.component').then(
            (m) => m.CustomerExcelComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 2,
          breadcrumb: 'excel clientes',
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
        redirectTo: URL_ADMIN_CLIENTS_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
