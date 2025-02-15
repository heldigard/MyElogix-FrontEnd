import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MODULE_COMMERCIAL } from '@globals';
import { isFinishedDeliveryOrder } from '@shared';
import { AuditInfoComponent } from '../../../../../../shared/components/audit-info/audit-info.component';
import { ProductSearchComponent } from '../../../../../../shared/components/product-search/product-search.component';
import { OrderActionButtonsComponent } from '../../../../components/order-action-buttons/order-action-buttons.component';
import { OrderCustomerInfoComponent } from '../../../../components/order-customer-info/order-customer-info.component';
import { OrderGeneralObservationsComponent } from '../../../../components/order-general-observations/order-general-observations.component';
import { ProductOrdersInfoComponent } from '../../../../components/product-orders-info/product-orders-info.component';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { OrderStatsComponent } from '../../../../components/order-stats/order-stats.component';

@Component({
  selector: 'app-create-edit-order',
  templateUrl: './create-edit-order.component.html',
  styleUrls: ['./create-edit-order.component.scss'],
  imports: [
    NgIf,
    OrderCustomerInfoComponent,
    OrderGeneralObservationsComponent,
    MatDividerModule,
    OrderActionButtonsComponent,
    ProductSearchComponent,
    AuditInfoComponent,
    ProductOrdersInfoComponent,
    OrderStatsComponent,
  ],
})
export class CreateEditOrderComponent {
  @Input() screenType!: string;
  @Input() title!: string;

  protected readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);
  protected readonly isOrderFinished = computed(() => {
    const order = this.order();
    if (!order) return false;
    return isFinishedDeliveryOrder(order);
  });

  protected readonly MODULE_COMMERCIAL = MODULE_COMMERCIAL;

  public productsTitle: string;
  @ViewChild('liteProductSearch') liteProductSearch!: ProductSearchComponent;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly orderService = inject(DeliveryOrderService);

  constructor() {
    this.productsTitle = 'Productos';

    // Add effect to track state changes
    effect(() => {
      const order = this.order();
      if (order) {
        // Force update by triggering change detection when order state changes
        this.isOrderFinished(); // This will re-evaluate the computed value
        // Force view update
        this.cdr.detectChanges();
      }
    });
  }

  getRowClass() {
    if (this.isOrderFinished()) {
      return 'row row-cols-1';
    } else {
      return 'row row-cols-2 g-0';
    }
  }

  getContentClass() {
    if (this.isOrderFinished()) {
      return 'col-12';
    } else {
      return 'col-8';
    }
  }

  focusLiteSearch() {
    if (this.liteProductSearch) {
      this.liteProductSearch.focusSearchInput();
    }
  }
}
