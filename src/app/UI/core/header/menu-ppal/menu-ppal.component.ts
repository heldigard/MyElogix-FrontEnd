import { NgIf } from '@angular/common';
import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import {
  URL_ADMIN,
  URL_BILLING,
  URL_COMMERCIAL,
  URL_DISPATCH,
  URL_HOME,
  URL_ORDERS,
  URL_PRODUCTION,
} from '@globals';
import { AvatarModule } from 'ngx-avatars';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
import { LoaderComponent } from '../../../modules/loader/pages/loader.component';
import { OrdersMenuComponent } from './components/orders-menu/orders-menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-menu-ppal',
  templateUrl: './menu-ppal.component.html',
  styleUrls: ['./menu-ppal.component.scss'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
    NgIf,
    MatMenuModule,
    AvatarModule,
    FontAwesomeModule,
    LoaderComponent,
    OrdersMenuComponent,
    UserMenuComponent,
    NgOptimizedImage,
  ],
})
export class MenuPpalComponent implements OnInit {
  protected readonly authImplService = inject(AuthenticationImplService);

  // Usar signals en lugar de subscripciones
  protected readonly currentUser = computed(() =>
    this.authImplService.getCurrentUser(),
  );
  protected readonly isLoggedIn = computed(() =>
    this.authImplService.getIsLoggedIn(),
  );

  // Constants
  protected readonly faDoorOpen = faDoorOpen;
  protected readonly URL_ORDERS = URL_ORDERS;
  protected readonly URL_BILLING = URL_BILLING;
  protected readonly URL_DISPATCH = URL_DISPATCH;
  protected readonly URL_PRODUCTION = URL_PRODUCTION;
  protected readonly URL_COMMERCIAL = URL_COMMERCIAL;
  protected readonly URL_ADMIN = URL_ADMIN;
  protected readonly URL_HOME = URL_HOME;
  private readonly ORDERS_MENU_TIMEOUT = 12000;
  private readonly USER_MENU_TIMEOUT = 10000;

  @ViewChild('ordersMenuTrigger') ordersMenuTrigger?: MatMenuTrigger;
  @ViewChild('userMenuTrigger') userMenuTrigger?: MatMenuTrigger;

  constructor() {}

  ngOnInit(): void {
    // Verificar estado inicial
    if (!this.currentUser()?.id || this.currentUser()?.id === -1) {
      this.authImplService.navigateToLogin();
    }
  }

  onLogout() {
    this.authImplService.logout();
  }

  getCurrentUserName(): string {
    try {
      const user = this.currentUser();
      return user ? `${user.firstName} ${user.lastName}`.trim() : '';
    } catch (error) {
      console.error('Error getting user name:', error);
      return '';
    }
  }

  ordersMenuHover() {
    this.ordersMenuTrigger?.openMenu();
    this.userMenuTrigger?.closeMenu();
    setTimeout(
      () => this.ordersMenuTrigger?.closeMenu(),
      this.ORDERS_MENU_TIMEOUT,
    );
  }

  userMenuHover() {
    this.userMenuTrigger?.openMenu();
    this.ordersMenuTrigger?.closeMenu();
    setTimeout(() => this.userMenuTrigger?.closeMenu(), this.USER_MENU_TIMEOUT);
  }
}
