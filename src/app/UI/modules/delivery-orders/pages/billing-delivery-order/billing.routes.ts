import { Routes } from '@angular/router';
import {
  URL_BILLING_MAIN,
  URL_BILLING_SUMMARY,
  URL_BILLING_VIEW,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { ERole } from '../../../../../users/domain/models/ERole';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';

export const BILLINGROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./billing-delivery-order.component').then(
        (m) => m.BillingDeliveryOrderComponent,
      ),
    children: [
      {
        path: URL_BILLING_MAIN,
        loadComponent: () =>
          import('./pages/billing-orders/billing-orders.component').then(
            (m) => m.BillingOrdersComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 0,
          breadcrumb: { skip: true },
          permissions: [EPermission.BILLING_READ, EPermission.BILLING_ALL],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_BILLING,
          ],
        },
      },
      {
        path: URL_BILLING_SUMMARY,
        loadComponent: () =>
          import('./pages/billing-summary/billing-summary.component').then(
            (m) => m.BillingSummaryComponent,
          ),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'resumen',
          permissions: [EPermission.BILLING_READ, EPermission.BILLING_ALL],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_BILLING,
          ],
        },
      },
      {
        path: URL_BILLING_VIEW,
        loadComponent: () =>
          import(
            './pages/billing-view-order/billing-view-order.component'
          ).then((m) => m.BillingViewOrderComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 2,
          breadcrumb: 'imprimir cliente',
          permissions: [EPermission.BILLING_UPDATE, EPermission.BILLING_ALL],
          roles: [
            ERole.SUPER_ADMIN,
            ERole.ADMIN,
            ERole.GLOBAL_MANAGER,
            ERole.MANAGER_BILLING,
          ],
        },
      },
      {
        path: '',
        redirectTo: URL_BILLING_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
