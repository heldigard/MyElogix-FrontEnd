import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { EStatus } from 'src/app/delivery-orders/domain/models/EStatus';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { SCREEN_TYPE_VIEW_DISPATCH } from '../../../../../../../globals';
import { DeliveryOrdersSearchComponent } from '../../../../components/delivery-orders-search/delivery-orders-search.component';

@Component({
  selector: 'app-dispatch-orders',
  templateUrl: './dispatch-orders.component.html',
  styleUrls: ['./dispatch-orders.component.scss'],
  imports: [DeliveryOrdersSearchComponent, MatDividerModule],
})
export class DispatchOrdersComponent {
  public finishedTitle: string;
  public deliveredTitle: string;
  public allTitle: string;
  public screenType: string = SCREEN_TYPE_VIEW_DISPATCH;
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  protected readonly EStatus = EStatus;

  constructor() {
    this.finishedTitle = 'Ordenes Sin Despachar';
    this.deliveredTitle = 'Ordenes Despachadas';
    this.allTitle = 'Todas las Ordenes';
  }

  onActiveDeliveryOrderView($event: any): void {
    this.orderService.setActiveDeliveryOrderView($event, this.screenType);
  }
}
