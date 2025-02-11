import { Routes } from '@angular/router';
import {
  ROLES_BILLING,
  ROLES_COMMERCIAL,
  ROLES_DISPATCH,
  ROLES_PRODUCTION,
  URL_BILLING,
  URL_COMMERCIAL,
  URL_DISPATCH,
  URL_PRODUCTION,
} from '@globals';
import { hasRoleGuard } from '../authentication/guards/has-role.guard';
import { isLoggedInGuard } from '../authentication/guards/is-logged-in.guard';

export const DELIVERY_ORDERSROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/delivery-orders.component').then(
        (m) => m.DeliveryOrdersComponent,
      ),
    children: [
      {
        path: URL_COMMERCIAL,
        loadChildren: () =>
          import('./pages/commercial-delivery-order/commercial.routes').then(
            (m) => m.COMMERCIALROUTES,
          ),
        canActivate: [isLoggedInGuard, hasRoleGuard],
        data: {
          roles: ROLES_COMMERCIAL,
          breadcrumb: 'comercial',
        },
      },
      {
        path: URL_PRODUCTION,
        loadChildren: () =>
          import('./pages/production-delivery-order/production.routes').then(
            (m) => m.PRODUCTIONROUTES,
          ),
        canActivate: [isLoggedInGuard, hasRoleGuard],
        data: {
          roles: ROLES_PRODUCTION,
          breadcrumb: 'produccion',
        },
      },
      {
        path: URL_DISPATCH,
        loadChildren: () =>
          import('./pages/dispatch-delivery-order/dispatch.routes').then(
            (m) => m.DISPATCHROUTES,
          ),
        canActivate: [isLoggedInGuard, hasRoleGuard],
        data: {
          roles: ROLES_DISPATCH,
          breadcrumb: 'despachos',
        },
      },
      {
        path: URL_BILLING,
        loadChildren: () =>
          import('./pages/billing-delivery-order/billing.routes').then(
            (m) => m.BILLINGROUTES,
          ),
        canActivate: [isLoggedInGuard, hasRoleGuard],
        data: {
          roles: ROLES_BILLING,
          breadcrumb: 'facturacion',
        },
      },
    ],
  },
];
