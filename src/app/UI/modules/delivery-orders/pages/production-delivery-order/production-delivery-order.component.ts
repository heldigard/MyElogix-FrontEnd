import { NgClass, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  URL_ORDERS,
  URL_PRODUCTION,
  URL_PRODUCTION_MAIN,
  URL_PRODUCTION_VIEW,
} from '@globals';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-production-delivery-order',
  templateUrl: './production-delivery-order.component.html',
  styleUrls: ['./production-delivery-order.component.scss'],
  animations: [slideInAnimation],
  imports: [
    MatTabsModule,
    RouterLinkActive,
    RouterLink,
    NgClass,
    PestaniaLabelComponent,
    RouterOutlet,
    NgIf,
  ],
})
export class ProductionDeliveryOrderComponent {
  public deliveryOrdersTitle: string;
  public deliveryOrdersIcon: string;
  public viewOrderTitle: string;
  public viewOrderIcon: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_PRODUCTION_MAIN = URL_PRODUCTION_MAIN;
  protected readonly URL_PRODUCTION_VIEW = URL_PRODUCTION_VIEW;

  constructor() {
    this.deliveryOrdersTitle = 'Ordenes';
    this.deliveryOrdersIcon = 'delivery-orders-icon.png';
    this.viewOrderTitle = 'Ver Orden';
    this.viewOrderIcon = 'view-delivery-order-icon.png';
    this.animationState = 0;
  }

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }

  onClickMain() {
    this.router.navigate([URL_ORDERS, URL_PRODUCTION, URL_PRODUCTION_MAIN], {
      relativeTo: this.route.root,
    });
  }
}
