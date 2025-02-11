import { Routes } from '@angular/router';
import { URL_DISPATCH_MAIN, URL_DISPATCH_VIEW } from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { ERole } from '../../../../../users/domain/models/ERole';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const DISPATCHROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./dispatch-delivery-order.component').then(
        (m) => m.DispatchDeliveryOrderComponent,
      ),
    children: [
      {
        path: URL_DISPATCH_MAIN,
        loadComponent: () =>
          import('./pages/dispatch-orders/dispatch-orders.component').then(
            (m) => m.DispatchOrdersComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 0,
          breadcrumb: { skip: true },
          permissions: [EPermission.DISPATCH_READ, EPermission.DISPATCH_ALL],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_DISPATCH,
          ],
        },
      },
      {
        path: URL_DISPATCH_VIEW,
        loadComponent: () =>
          import(
            './pages/dispatch-view-order/dispatch-view-order.component'
          ).then((m) => m.DispatchViewOrderComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'ver orden',
          permissions: [EPermission.DISPATCH_UPDATE, EPermission.DISPATCH_ALL],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_DISPATCH,
          ],
        },
      },
      {
        path: '',
        redirectTo: URL_DISPATCH_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
