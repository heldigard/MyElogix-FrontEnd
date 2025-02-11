import { Routes } from '@angular/router';
import { URL_AUTH_LOGIN } from '@globals';

export const AUTHENTICATIONROUTES: Routes = [
  {
    path: URL_AUTH_LOGIN,
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
