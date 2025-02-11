import { Routes } from '@angular/router';
import {
  URL_ADMIN_CITIES,
  URL_ADMIN_CLIENTS,
  URL_ADMIN_NEIGHBORHOODS,
  URL_ADMIN_PRODUCTS,
  URL_ADMIN_USERS,
} from '@globals';
import { isLoggedInGuard } from '../authentication/guards/is-logged-in.guard'

export const ADMINISTRATIONROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/administration.component').then(
        (m) => m.AdministrationComponent,
      ),
  },
  {
    path: URL_ADMIN_CLIENTS,
    loadChildren: () =>
      import(
        './pages/customer-administration/customer-administration.routes'
      ).then((m) => m.CUSTOMER_ADMINISTRATIONROUTES),
    data: { breadcrumb: 'clientes' },
  },
  {
    path: URL_ADMIN_PRODUCTS,
    loadChildren: () =>
      import(
        './pages/product-administration/product-administration.routes'
      ).then((m) => m.PRODUCT_ADMINISTRATIONROUTES),
    data: { breadcrumb: 'productos' },
  },
  {
    path: URL_ADMIN_NEIGHBORHOODS,
    loadChildren: () =>
      import(
        './pages/neighborhood-administration/neighborhood-administration.routes'
      ).then((m) => m.NEIGHBORHOOD_ADMINISTRATIONROUTES),
    data: { breadcrumb: 'barrios' },
  },
  {
    path: URL_ADMIN_CITIES,
    loadChildren: () =>
      import('./pages/city-administration/city-administration.routes').then(
        (m) => m.CITY_ADMINISTRATIONROUTES,
      ),
    data: { breadcrumb: 'ciudades' },
  },
  {
    path: URL_ADMIN_USERS,
    loadChildren: () =>
      import('./pages/user-administration/user-administration.routes').then(
        (m) => m.USER_ADMINISTRATIONROUTES,
      ),
    data: {
      breadcrumb: 'usuarios',
    },
  },
];
