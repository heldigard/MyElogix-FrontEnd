import { NgIf } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { EDIT_ORDER_TITLE, SCREEN_TYPE_VIEW_PRODUCTION } from '@globals';
import { first } from 'rxjs';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { OrderHeaderComponent } from '../../../../components/order-header/order-header.component';
import { PrintBillOrderComponent } from '../../../../components/print-bill-order/print-bill-order.component';
import { ViewOrderComponent } from '../../../../components/view-order/view-order.component';

@Component({
  selector: 'app-production-view-order',
  templateUrl: './production-view-order.component.html',
  styleUrls: ['./production-view-order.component.scss'],
  imports: [
    NgIf,
    PrintBillOrderComponent,
    MatDividerModule,
    OrderHeaderComponent,
    ViewOrderComponent,
  ],
})
export class ProductionViewOrderComponent {
  public editOrderTitle: string;
  private readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);

  private readonly route = inject(ActivatedRoute);

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  protected readonly SCREEN_TYPE_VIEW_PRODUCTION = SCREEN_TYPE_VIEW_PRODUCTION;

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
            SCREEN_TYPE_VIEW_PRODUCTION,
          );
        }
      });
    });
  }
}
