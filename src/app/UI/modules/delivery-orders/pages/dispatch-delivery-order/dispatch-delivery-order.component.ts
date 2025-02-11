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
  URL_DISPATCH,
  URL_DISPATCH_MAIN,
  URL_DISPATCH_VIEW,
  URL_ORDERS,
} from '@globals';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-dispatch-delivery-order',
  templateUrl: './dispatch-delivery-order.component.html',
  styleUrls: ['./dispatch-delivery-order.component.scss'],
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
export class DispatchDeliveryOrderComponent {
  public deliveryOrdersTitle: string;
  public deliveryOrdersIcon: string;
  public viewOrderTitle: string;
  public viewOrderIcon: string;
  public animationState: number;
  // @ts-ignore
  @ViewChild(MatTabNav, { static: true }) navigation: MatTabNav;

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_DISPATCH_MAIN = URL_DISPATCH_MAIN;
  protected readonly URL_DISPATCH_VIEW = URL_DISPATCH_VIEW;

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
    this.router.navigate([URL_ORDERS, URL_DISPATCH, URL_DISPATCH_MAIN], {
      relativeTo: this.route.root,
    });
  }
}
