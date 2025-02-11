import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SCREEN_TYPE_VIEW_PRODUCTION } from '@globals';
import { EStatus } from '../../../../../delivery-orders/domain/models/EStatus';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { ProductOrder } from '../../../../../product-order/domain/model/ProductOrder';
import { ProductOrderService } from '../../../../../product-order/infrastructure/product-order.service';
import { AuditInfoComponent } from '../../../../shared/components/audit-info/audit-info.component';
import { isFinishedProductOrder } from '../../../../shared/utils';
import { ProductOrderActionsComponent } from './components/product-order-actions/product-order-actions.component';
import { ProductOrderFieldsComponent } from './components/product-order-fields/product-order-fields.component';
import { ProductOrderHeaderComponent } from './components/product-order-header/product-order-header.component';

@Component({
  selector: 'app-product-orders-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ProductOrderHeaderComponent,
    ProductOrderFieldsComponent,
    ProductOrderActionsComponent,
    AuditInfoComponent,
    NgFor,
  ],
  templateUrl: './product-orders-info.component.html',
  styleUrls: ['./product-orders-info.component.scss'],
})
export class ProductOrdersInfoComponent {
  @Input() screenType!: string;
  @Output() lastFieldEnter = new EventEmitter<void>();

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly productOrderService: ProductOrderService =
    inject(ProductOrderService);

  private readonly state = computed(() => this.orderService.getState()());
  private readonly order = computed(() => this.state().order);

  protected readonly enrichedOrders = computed(() => {
    // Obtener los orders directamente del servicio
    const orders = this.productOrderService.getProductOrders();
    return orders.map((order) => ({
      order,
      backgroundClass: this.productOrderService.getBackgroundClass(order),
      orderStatus:
        this.order()?.status?.name ??
        EStatus.PENDING,
      shouldExpand: !isFinishedProductOrder(order),
    }));
  });

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  protected readonly SCREEN_TYPE_VIEW_PRODUCTION = SCREEN_TYPE_VIEW_PRODUCTION;

  trackByOrder(index: number, enriched: { order: ProductOrder }): number {
    return enriched.order.id ?? 0;
  }

  getProductOrderAtIndex(index: number) {
    return this.enrichedOrders()[index].order;
  }

  onLastFieldEntered() {
    console.log('onLastFieldEntered');
    this.lastFieldEnter.emit();
  }

  protected getBackgroundClass(order: ProductOrder): string {
    console.log('getBackgroundClass');
    return this.productOrderService.getBackgroundClass(order);
  }

  protected getOrderStatus(): EStatus {
    return (
      this.order()?.status?.name ??
      EStatus.PENDING
    );
  }

  protected onAdvanceStatus(event: any) {
    const productOrder = event as ProductOrder;
    if (!productOrder) return;
    if (isFinishedProductOrder(productOrder)) {
      this.checkIfOrderIsFinished();
    }
  }

  // TypeScript
  protected checkIfOrderIsFinished(): void {
    const currentDeliveryOrder = this.order();
    if (!currentDeliveryOrder?.productOrders) return;

    // Check if every product order is finished/cancelled/delivered
    const allFinished = currentDeliveryOrder.productOrders.every((po) =>
      isFinishedProductOrder(po),
    );

    if (allFinished) {
      // Query the backend for the updated order
      this.orderService.refreshOrderStateById(currentDeliveryOrder.id!);
    }
  }

  protected shouldExpandAccordion(index: number): boolean {
    const productOrder = this.getProductOrderAtIndex(index);
    if (!productOrder) return false;

    return !isFinishedProductOrder(productOrder);
  }
}
