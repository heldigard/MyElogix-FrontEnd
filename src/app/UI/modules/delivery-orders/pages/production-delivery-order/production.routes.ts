import { Routes } from '@angular/router';
import { URL_PRODUCTION_MAIN, URL_PRODUCTION_VIEW } from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { ERole } from '../../../../../users/domain/models/ERole';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const PRODUCTIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./production-delivery-order.component').then(
        (m) => m.ProductionDeliveryOrderComponent,
      ),
    children: [
      {
        path: URL_PRODUCTION_MAIN,
        loadComponent: () =>
          import('./pages/production-orders/production-orders.component').then(
            (m) => m.ProductionOrdersComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 0,
          breadcrumb: { skip: true },
          permissions: [
            EPermission.PRODUCTION_READ,
            EPermission.PRODUCTION_ALL,
          ],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_PRODUCTION,
          ],
        },
      },
      {
        path: URL_PRODUCTION_VIEW,
        loadComponent: () =>
          import(
            './pages/production-view-order/production-view-order.component'
          ).then((m) => m.ProductionViewOrderComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'ver orden',
          permissions: [
            EPermission.PRODUCTION_UPDATE,
            EPermission.PRODUCTION_ALL,
          ],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_PRODUCTION,
          ],
        },
      },
      {
        path: '',
        redirectTo: URL_PRODUCTION_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
