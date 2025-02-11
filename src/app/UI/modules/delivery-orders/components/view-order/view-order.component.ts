import { NgIf } from '@angular/common';
import { Component, computed, effect, inject, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { AuditInfoComponent } from '../../../../shared/components/audit-info/audit-info.component';
import { OrderActionButtonsComponent } from '../order-action-buttons/order-action-buttons.component';
import { OrderCustomerInfoComponent } from '../order-customer-info/order-customer-info.component';
import { OrderGeneralObservationsComponent } from '../order-general-observations/order-general-observations.component';
import { OrderStatsComponent } from '../order-stats/order-stats.component';
import { ProductOrdersInfoComponent } from '../product-orders-info/product-orders-info.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
  imports: [
    NgIf,
    OrderCustomerInfoComponent,
    OrderGeneralObservationsComponent,
    MatDividerModule,
    ProductOrdersInfoComponent,
    OrderActionButtonsComponent,
    MatProgressSpinner,
    AuditInfoComponent,
    OrderStatsComponent,
  ],
  standalone: true,
})
export class ViewOrderComponent {
  @Input() screenType: string = '';
  @Input() title: string = '';

  protected readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      const order = this.order();
      if (order.id) {
        return;
      }
    });
  }
}
