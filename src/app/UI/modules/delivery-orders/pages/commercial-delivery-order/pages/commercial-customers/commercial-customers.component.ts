import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MODULE_COMMERCIAL, SCREEN_TYPE_EDIT } from '@globals';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { CustomerSearchComponent } from '../../../../../../shared/components/customer-search/customer-search.component';
import { PestaniaLabelComponent } from '../../../../../../shared/components/pestania-label/pestania-label.component';
import { DeliveryOrdersSearchComponent } from '../../../../components/delivery-orders-search/delivery-orders-search.component';

@Component({
  selector: 'app-commercial-customers',
  templateUrl: './commercial-customers.component.html',
  styleUrls: ['./commercial-customers.component.scss'],
  imports: [
    CustomerSearchComponent,
    DeliveryOrdersSearchComponent,
    MatTabsModule,
    PestaniaLabelComponent,
  ],
  standalone: true,
})
export class CommercialCustomersComponent {
  public deliveryOrdersTitle = 'Últimas Órdenes';
  public clientsTitle = 'Clientes';
  public moduleName = MODULE_COMMERCIAL;
  public screenType: string = SCREEN_TYPE_EDIT;
  public ordersCommercialLastOrdersTitle = 'Últimas Dia';
  public ordersCommercialSearchOrdersTitle = 'Búsqueda Avanzada';
  public ordersLastReadyBillingIcon =
    'delivery-order-billing-last-ready-icon.png';
  public ordersLastSearchIcon = 'delivery-order-search-last-icon.png';

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  constructor() {}

  onActiveDeliveryOrderView($event: any): void {
    this.orderService.setActiveDeliveryOrderView($event, this.screenType);
  }
}
