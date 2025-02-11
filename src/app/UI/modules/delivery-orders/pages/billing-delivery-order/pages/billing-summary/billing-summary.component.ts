import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BillingDeliveryOrderService } from '../../billing-delivery-order.service';
import { SummaryBillingSearchComponent } from '../../components/summary-billing-search/summary-billing-search.component';

@Component({
  selector: 'app-billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.scss'],
  imports: [SummaryBillingSearchComponent, MatButton],
})
export class BillingSummaryComponent {
  public ordersBillingDayTitle: string;
  public ordersBillingDayModule: string;

  public ordersBillingLastTitle: string;
  public ordersBillingLastModule: string;

  private readonly billingDeliveryOrderService: BillingDeliveryOrderService =
    inject(BillingDeliveryOrderService);

  constructor() {
    this.ordersBillingDayTitle = 'Ordenes Hoy';
    this.ordersBillingLastTitle = 'Ordenes Ultimos Dias';

    this.ordersBillingDayModule = 'onlyDay';
    this.ordersBillingLastModule = 'lastDays';
  }

  onPrintSelectedDaily() {
    this.billingDeliveryOrderService.setOrdersOneCustomerToBill();
  }
}
