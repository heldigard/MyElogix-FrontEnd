import { NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
export class ProductionViewOrderComponent implements OnInit, OnDestroy {
  public editOrderTitle: string;
  protected readonly order = computed(() =>
    this.orderService.getCurrentOrder(),
  );
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  protected readonly SCREEN_TYPE_VIEW_PRODUCTION = SCREEN_TYPE_VIEW_PRODUCTION;
  private currentOrderId: number | null = null;

  constructor() {
    this.editOrderTitle = EDIT_ORDER_TITLE;

    effect(() => {
      const order = this.order();
      // If we have order data
      if (order?.id) {
        this.currentOrderId = order.id;
        this.subscribeToOrderUpdates();
        return;
      }

      // Load from URL parameters if available
      this.route.queryParams.pipe(first()).subscribe((params) => {
        const id = params['deliveryOrderId'];
        if (id) {
          this.currentOrderId = parseInt(id);
          this.orderService.setActiveDeliveryOrderView(
            this.currentOrderId,
            SCREEN_TYPE_VIEW_PRODUCTION,
          );
          this.subscribeToOrderUpdates();
        }
      });
    });
  }

  ngOnInit(): void {
    // Subscribe to WebSocket updates when component initializes
    // and we have a valid order ID
    if (this.currentOrderId) {
      this.subscribeToOrderUpdates();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from WebSocket when component is destroyed
    this.orderService.unsubscribeFromOrderUpdates();
  }

  private subscribeToOrderUpdates(): void {
    if (this.currentOrderId) {
      console.log(
        `Subscribing to WebSocket updates for order ${this.currentOrderId}`,
      );
      this.orderService.subscribeToOrderUpdates(this.currentOrderId);
    }
  }
}
