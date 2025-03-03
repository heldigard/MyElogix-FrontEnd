import { NgIf } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import {
  EDIT_ORDER_TITLE,
  SCREEN_TYPE_VIEW_BILL,
  SCREEN_TYPE_VIEW_DISPATCH,
} from '@globals';
import { first } from 'rxjs';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { OrderHeaderComponent } from '../../../../components/order-header/order-header.component';
import { PrintBillOrderComponent } from '../../../../components/print-bill-order/print-bill-order.component';
import { ViewOrderComponent } from '../../../../components/view-order/view-order.component';

@Component({
  selector: 'app-dispatch-view-order',
  templateUrl: './dispatch-view-order.component.html',
  styleUrls: ['./dispatch-view-order.component.scss'],
  imports: [
    NgIf,
    PrintBillOrderComponent,
    MatDividerModule,
    OrderHeaderComponent,
    ViewOrderComponent,
  ],
})
export class DispatchViewOrderComponent {
  public editOrderTitle: string;
  protected readonly order = computed(() =>
    this.orderService.getCurrentOrder(),
  );
  private readonly route = inject(ActivatedRoute);

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  protected readonly SCREEN_TYPE_VIEW_DISPATCH = SCREEN_TYPE_VIEW_DISPATCH;

  constructor() {
    this.editOrderTitle = EDIT_ORDER_TITLE;

    effect(() => {
      const order = this.order();
      // Skip if we already have order data
      if (order?.id) {
        return;
      }

      // Load from URL parameters if available
      this.route.queryParams.pipe(first()).subscribe((params) => {
        const id = params['deliveryOrderId'];
        if (id) {
          // console.log('Loading delivery order from URL:', id);
          this.orderService.setActiveDeliveryOrderView(
            parseInt(id),
            SCREEN_TYPE_VIEW_DISPATCH,
          );
        }
      });
    });
  }
}
