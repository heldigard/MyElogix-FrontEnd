import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { isDeliveredProductOrder, isFinishedProductOrder } from '@shared';
import { EStatus } from 'src/app/delivery-orders/domain/models/EStatus';
import {
  SCREEN_TYPE_VIEW_DISPATCH,
  SCREEN_TYPE_VIEW_PRODUCTION,
} from '../../../../../../../globals';
import { ProductOrder } from '../../../../../../../product-order/domain/model/ProductOrder';
import { ProductOrderService } from '../../../../../../../product-order/infrastructure/product-order.service';

@Component({
  selector: 'app-product-order-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
  ],
  templateUrl: './product-order-actions.component.html',
  styleUrls: ['./product-order-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductOrderActionsComponent {
  @Input() orderStatus: EStatus = EStatus.PENDING;
  @Input() screenType: string = '';
  @Input() productOrder!: ProductOrder;
  @Output() advanceStatus = new EventEmitter<ProductOrder>();
  isSaving: boolean = false;
  private readonly productOrderService: ProductOrderService =
    inject(ProductOrderService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected readonly faTruck = faTruck;

  get showReadyProduction(): boolean {
    if (!this.orderStatus || !this.productOrder || !this.screenType) {
      return false;
    }

    const isProductionStatus = this.orderStatus === EStatus.PRODUCTION;
    const isNotFinished = !this.isProductOrderFinished();
    const isProductionView = this.screenType === SCREEN_TYPE_VIEW_PRODUCTION;

    return isProductionStatus && isNotFinished && isProductionView;
  }

  get showReadyDispatch(): boolean {
    if (!this.orderStatus || !this.productOrder || !this.screenType) {
      return false;
    }

    const isFinishedStatus = this.orderStatus === EStatus.FINISHED;
    const isNotDelivered = !this.isProductOrderDelivered();
    const isDispatchView = this.screenType === SCREEN_TYPE_VIEW_DISPATCH;

    return isFinishedStatus && isNotDelivered && isDispatchView;
  }

  async onAdvanceStatus(): Promise<void> {
    try {
      this.isSaving = true;
      const updatedOrder = await this.productOrderService.advanceOrderStatus(
        this.productOrder.id!,
      );

      if (updatedOrder) {
        // Create new order with updated data
        const newOrder = {
          ...this.productOrder,
          ...updatedOrder,
        };

        // Update product order in service state
        this.productOrderService.onProductOrderUpdate({
          index: this.productOrderService.getIndex(this.productOrder),
          changes: updatedOrder,
        });

        // Update local component state
        this.productOrder = newOrder;
        this.advanceStatus.emit(newOrder);

        // Force change detection since we're using OnPush
        this.cdr.markForCheck();
      }
    } catch (error) {
      console.error('Error advancing status:', error);
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  private isProductOrderFinished(): boolean {
    return isFinishedProductOrder(this.productOrder) ?? false;
  }

  private isProductOrderDelivered(): boolean {
    return isDeliveredProductOrder(this.productOrder) ?? false;
  }
}
