import { NgClass } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  URL_BILLING,
  URL_BILLING_MAIN,
  URL_BILLING_SUMMARY,
  URL_BILLING_VIEW,
  URL_ORDERS,
} from '@globals';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-billing-delivery-order',
  templateUrl: './billing-delivery-order.component.html',
  styleUrls: ['./billing-delivery-order.component.scss'],
  animations: [slideInAnimation],
  imports: [
    MatTabsModule,
    RouterLinkActive,
    RouterLink,
    NgClass,
    PestaniaLabelComponent,
    RouterOutlet,
  ],
})
export class BillingDeliveryOrderComponent {
  public deliveryOrdersGroupedDayTitle: string;
  public deliveryOrdersGroupedTitle: string;

  public ordersBillingIcon: string;
  public ordersReadyBillingIcon: string;

  public ordersViewTitle: string;
  public ordersViewIcon: string;

  public ordersBillingSummaryTitle: string;
  public ordersBillingReadyTitle: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_BILLING_MAIN = URL_BILLING_MAIN;
  protected readonly URL_BILLING_SUMMARY = URL_BILLING_SUMMARY;
  protected readonly URL_BILLING_VIEW = URL_BILLING_VIEW;

  constructor() {
    this.deliveryOrdersGroupedDayTitle = 'Totales Dia';
    this.deliveryOrdersGroupedTitle = 'Totales Cliente';
    this.ordersBillingIcon = 'delivery-order-billing-summary-icon.png';
    this.ordersReadyBillingIcon = 'delivery-order-billing-ready-icon.png';

    this.ordersViewTitle = 'Imprimir Cliente';
    this.ordersViewIcon = 'delivery-order-billing-view-icon.png';

    this.ordersBillingSummaryTitle = 'Resumen Ordenes';
    this.ordersBillingReadyTitle = 'Imprimir Ordenes';

    this.animationState = 0;
  }

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }

  onClickMain() {
    this.router.navigate([URL_ORDERS, URL_BILLING, URL_BILLING_MAIN], {
      relativeTo: this.route.root,
    });
  }

  onClickSummary() {
    this.router.navigate([URL_ORDERS, URL_BILLING, URL_BILLING_SUMMARY], {
      relativeTo: this.route.root,
    });
  }
}
