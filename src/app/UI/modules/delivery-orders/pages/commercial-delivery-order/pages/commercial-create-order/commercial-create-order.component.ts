import { NgIf } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SCREEN_TYPE_CREATE } from '@globals';
import { first } from 'rxjs';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { OrderHeaderComponent } from '../../../../components/order-header/order-header.component';
import { CreateEditOrderComponent } from '../../components/create-edit-order/create-edit-order.component';

@Component({
  selector: 'app-commercial-create-order',
  templateUrl: './commercial-create-order.component.html',
  styleUrls: ['./commercial-create-order.component.scss'],
  standalone: true,
  imports: [NgIf, OrderHeaderComponent, CreateEditOrderComponent],
})
export class CommercialCreateOrderComponent {
  public createOrderTitle: string;
  private readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  private readonly route = inject(ActivatedRoute);
  protected readonly SCREEN_TYPE_CREATE = SCREEN_TYPE_CREATE;

  constructor() {
    this.createOrderTitle = 'Nueva Orden';

    // Add a flag to track if we've already started creating an order
    let isCreatingOrder = false;

    effect(() => {
      const order = this.order();

      // If we already have an order ID or we're in the process of creating one, exit
      if (order.customer?.id || isCreatingOrder) {
        return;
      }

      this.route.queryParams.pipe(first()).subscribe((params) => {
        const customerId = params['customerId'];

        if (customerId && !order.customer?.id) {
          isCreatingOrder = true;
          this.orderService.createNewOrderFromCustomer(parseInt(customerId));
        }
      });
    });
  }
}
