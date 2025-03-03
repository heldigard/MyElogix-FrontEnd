import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EStatus } from '../../../../../../../delivery-orders/domain/models/EStatus';
import { ProductOrder } from '../../../../../../../product-order/domain/model/ProductOrder';
import { ProductOrderService } from '../../../../../../../product-order/infrastructure/product-order.service';
import {
  isFinishedProductOrder,
  isFinishedStatus,
  isScreenEdit,
} from '../../../../../../shared';

@Component({
  selector: 'app-product-order-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatDividerModule,
  ],
  templateUrl: './product-order-header.component.html',
  styleUrls: ['./product-order-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductOrderHeaderComponent {
  @Input() productOrder!: ProductOrder;
  @Input() screenType: string = '';
  @Input() orderStatus: EStatus = EStatus.PENDING;
  isSaving: boolean = false;

  private readonly productOrderService: ProductOrderService =
    inject(ProductOrderService);

  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  async onRemoveClick(event: Event): Promise<void> {
    try {
      this.isSaving = true;
      const updatedOrder = await this.productOrderService.onProductOrderRemove(
        this.productOrder,
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

  getStatusText(): string {
    return this.productOrder?.status?.description?.toUpperCase() ?? '';
  }

  get strikethrough(): string {
    return this.productOrderService.getStrikethrough(this.productOrder);
  }

  get showRemoveButton(): boolean {
    return (
      isScreenEdit(this.screenType) &&
      !isFinishedProductOrder(this.productOrder) &&
      !isFinishedStatus(this.orderStatus)
    );
  }

  protected getBackgroundClass(order: ProductOrder): string {
    return this.productOrderService.getBackgroundClass(order);
  }
}
