import { Component, inject } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  URL_ADMIN,
  URL_BILLING,
  URL_COMMERCIAL,
  URL_DISPATCH,
  URL_ORDERS,
  URL_PRODUCTION,
} from '@globals';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthenticationImplService } from '../../../../../../shared/infrastructure/auth/authentication-impl.service';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-orders-menu',
    imports: [
        MatMenu,
        RouterLink,
        MatMenuTrigger,
        MatIcon,
        NgIf,
        MatButton,
        MatMenuItem,
        RouterLinkActive,
    ],
    templateUrl: './orders-menu.component.html',
    styleUrl: './orders-menu.component.scss'
})
export class OrdersMenuComponent {
  protected authService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );
  ordersMenuTrigger: any;
  protected readonly URL_ORDERS = URL_ORDERS;
  protected readonly URL_COMMERCIAL = URL_COMMERCIAL;
  protected readonly URL_BILLING = URL_BILLING;
  protected readonly URL_ADMIN = URL_ADMIN;
  protected readonly URL_DISPATCH = URL_DISPATCH;
  protected readonly URL_PRODUCTION = URL_PRODUCTION;
}
