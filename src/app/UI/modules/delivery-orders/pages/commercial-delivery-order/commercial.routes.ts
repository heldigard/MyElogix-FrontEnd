import { Routes } from '@angular/router';
import {
  ROLES_MANAGER,
  URL_COMMERCIAL_CREATE,
  URL_COMMERCIAL_EDIT,
  URL_COMMERCIAL_MAIN,
} from '@globals';
import { EPermission } from '../../../../../users/domain/models/EPermission';
import { hasPermissionGuard } from '../../../authentication/guards/has-permission.guard';
import { isLoggedInGuard } from '../../../authentication/guards/is-logged-in.guard';
import { editExitGuard } from '../../guards/edit-exit.guard';

// This routes can be accessed only if the user is logged in
// also if the user is a commercial user or admin

export const COMMERCIALROUTES: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./commercial-delivery-order.component').then(
        (m) => m.CommercialDeliveryOrderComponent,
      ),
    children: [
      {
        path: URL_COMMERCIAL_MAIN,
        loadComponent: () =>
          import(
            './pages/commercial-customers/commercial-customers.component'
          ).then((m) => m.CommercialCustomersComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 0,
          breadcrumb: { skip: true },
          permissions: [
            EPermission.COMMERCIAL_READ,
            EPermission.COMMERCIAL_ALL,
          ],
          roles: ROLES_MANAGER,
        },
      },
      {
        path: URL_COMMERCIAL_CREATE,
        loadComponent: () =>
          import(
            './pages/commercial-create-order/commercial-create-order.component'
          ).then((m) => m.CommercialCreateOrderComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        canDeactivate: [editExitGuard],
        data: {
          routeIdx: 1,
          breadcrumb: 'crear orden',
          permissions: [
            EPermission.COMMERCIAL_CREATE,
            EPermission.COMMERCIAL_ALL,
          ],
          roles: ROLES_MANAGER,
        },
      },
      {
        path: URL_COMMERCIAL_EDIT,
        loadComponent: () =>
          import(
            './pages/commercial-edit-order/commercial-edit-order.component'
          ).then((m) => m.CommercialEditOrderComponent),
        canActivate: [isLoggedInGuard, hasPermissionGuard],
        data: {
          routeIdx: 2,
          breadcrumb: 'editar orden',
          permissions: [
            EPermission.COMMERCIAL_UPDATE,
            EPermission.COMMERCIAL_ALL,
          ],
          roles: ROLES_MANAGER,
        },
      },
      {
        path: '',
        redirectTo: URL_COMMERCIAL_MAIN,
        pathMatch: 'full',
      },
    ],
  },
];
