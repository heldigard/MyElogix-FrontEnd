import { Routes } from '@angular/router';
import {
  ROLES_MANAGER,
  URL_ADMIN_PRODUCTS_EDIT,
  URL_ADMIN_PRODUCTS_EXCEL,
  URL_ADMIN_PRODUCTS_MAIN,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const PRODUCT_ADMINISTRATIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./product-administration.component').then(
        (m) => m.ProductAdministrationComponent,
      ),
    children: [
      {
        path: URL_ADMIN_PRODUCTS_MAIN,
        loadComponent: () =>
          import('./pages/products/products.component').then(
            (m) => m.ProductsComponent,
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
        path: URL_ADMIN_PRODUCTS_EDIT,
        loadComponent: () =>
          import('./pages/product-edit/product-edit.component').then(
            (m) => m.ProductEditComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'editar producto',
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
        path: URL_ADMIN_PRODUCTS_EXCEL,
        loadComponent: () =>
          import('./pages/product-excel/product-excel.component').then(
            (m) => m.ProductExcelComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 2,
          breadcrumb: 'excel productos',
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
        redirectTo: URL_ADMIN_PRODUCTS_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
