import { NgIf } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { EDIT_ORDER_TITLE, SCREEN_TYPE_EDIT } from '@globals';
import { first } from 'rxjs';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { OrderHeaderComponent } from '../../../../components/order-header/order-header.component';
import { PrintBillOrderComponent } from '../../../../components/print-bill-order/print-bill-order.component';
import { CreateEditOrderComponent } from '../../components/create-edit-order/create-edit-order.component';

@Component({
  selector: 'app-commercial-edit-order',
  templateUrl: './commercial-edit-order.component.html',
  styleUrls: ['./commercial-edit-order.component.scss'],
  imports: [
    NgIf,
    OrderHeaderComponent,
    CreateEditOrderComponent,
    PrintBillOrderComponent,
    MatProgressSpinner,
  ],
})
export class CommercialEditOrderComponent {
  public editOrderTitle: string;
  protected readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(DeliveryOrderService);
  protected readonly SCREEN_TYPE_EDIT = SCREEN_TYPE_EDIT;

  constructor() {
    this.editOrderTitle = EDIT_ORDER_TITLE;
    // console.log('CommercialEditOrderComponent constructor');
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
            SCREEN_TYPE_EDIT,
          );
        }
      });
    });
  }
}
