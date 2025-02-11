import { Routes } from '@angular/router';
import { URL_ADMIN, URL_AUTH, URL_HOME, URL_ORDERS } from '@globals';
import { isLoggedInGuard } from './UI/modules/authentication/guards/is-logged-in.guard';

export const APPROUTES: Routes = [
  {
    path: '',
    redirectTo: URL_HOME,
    pathMatch: 'full',
  },
  {
    path: URL_AUTH,
    loadChildren: () =>
      import('./UI/modules/authentication/authentication.routes').then(
        (m) => m.AUTHENTICATIONROUTES,
      ),
  },
  {
    path: URL_HOME,
    loadComponent: () =>
      import('./UI/modules/home/pages/home.component').then(
        (m) => m.HomeComponent,
      ),
    canActivate: [isLoggedInGuard],
    data: { breadcrumb: 'inicio' },
  },
  {
    path: URL_ORDERS,
    canActivate: [isLoggedInGuard],
    data: { breadcrumb: 'ordenes' },
    loadChildren: () =>
      import('./UI/modules/delivery-orders/delivery-orders.routes').then(
        (m) => m.DELIVERY_ORDERSROUTES,
      ),
  },
  {
    path: URL_ADMIN,
    canActivate: [isLoggedInGuard],
    data: {
      breadcrumb: 'admin',
    },
    loadChildren: () =>
      import('./UI/modules/administration/administration.routes').then(
        (m) => m.ADMINISTRATIONROUTES,
      ),
  },
  {
    path: '**',
    data: { breadcrumb: { skip: true } },
    pathMatch: 'full',
    loadComponent: () =>
      import(
        './UI/shared/components/page-not-found/page-not-found.component'
      ).then((m) => m.PageNotFoundComponent),
  },
];
