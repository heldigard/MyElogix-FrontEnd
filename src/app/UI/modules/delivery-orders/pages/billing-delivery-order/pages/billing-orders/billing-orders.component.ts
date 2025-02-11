import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PestaniaLabelComponent } from '../../../../../../shared/components/pestania-label/pestania-label.component';
import { BillingDeliveryOrdersSearchComponent } from '../../components/billing-search/billing-search.component';

@Component({
  selector: 'app-billing-orders',
  templateUrl: './billing-orders.component.html',
  styleUrls: ['./billing-orders.component.scss'],
  imports: [
    BillingDeliveryOrdersSearchComponent,
    MatTabsModule,
    PestaniaLabelComponent,
  ],
})
export class BillingOrdersComponent {
  public ordersBillingDayTitle = 'Ordenes Hoy';
  public ordersBillingDayModule = 'onlyDay';

  public ordersBillingLastTitle = 'Ordenes Ultimos Dias';
  public ordersBillingLastModule = 'lastDays';

  public ordersLastReadyBillingIcon =
    'delivery-order-billing-last-ready-icon.png';
  public ordersBillingNoReadyLastTitle = 'Imprimir Ordenes';

  public ordersBillingReadyLastTitle = 'Ordenes Impresas';
  public ordersLastReadyYesBillingIcon =
    'delivery-order-billing-last-ready-yes-icon.png';

  constructor() {}
}
