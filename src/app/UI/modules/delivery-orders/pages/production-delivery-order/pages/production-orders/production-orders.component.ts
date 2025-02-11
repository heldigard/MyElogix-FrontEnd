import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { EStatus } from '../../../../../../../delivery-orders/domain/models/EStatus';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { SCREEN_TYPE_VIEW_PRODUCTION } from '../../../../../../../globals';
import { DeliveryOrdersSearchComponent } from '../../../../components/delivery-orders-search/delivery-orders-search.component';

@Component({
  selector: 'app-production-orders',
  templateUrl: './production-orders.component.html',
  styleUrls: ['./production-orders.component.scss'],
  imports: [DeliveryOrdersSearchComponent, MatDividerModule],
})
export class ProductionOrdersComponent {
  public pendingTitle: string;
  public productionTitle: string;
  public allTitle: string;
  public screenType: string = SCREEN_TYPE_VIEW_PRODUCTION;
  protected readonly EStatus = EStatus;
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  constructor() {
    this.pendingTitle = 'Ordenes Pendientes';
    this.productionTitle = 'Ordenes en Produccion';
    this.allTitle = 'Todas las Ordenes';
  }

  onActiveDeliveryOrderView($event: any): void {
    this.orderService.setActiveDeliveryOrderView($event, this.screenType);
  }
}
