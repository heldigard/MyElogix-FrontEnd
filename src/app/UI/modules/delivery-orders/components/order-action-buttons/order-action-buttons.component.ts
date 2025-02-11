import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isFinishedStatus, isScreenEdit } from '@shared';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../../../../delivery-orders/infrastructure/services/product.service';
import { DeliveryOrderBasicService } from '../../../../../delivery_order/infrastructure/delivery-order-basic/delivery-order-basic.service';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EStatus } from '../../../../../delivery-orders/domain/models/EStatus';
import { type DeliveryOrder } from '../../../../../delivery_order/domain/model/DeliveryOrder';
import {
  SCREEN_TYPE_CREATE,
  SCREEN_TYPE_EDIT,
  SCREEN_TYPE_VIEW_BILL,
  SCREEN_TYPE_VIEW_DISPATCH,
  SCREEN_TYPE_VIEW_PRODUCTION,
  URL_BILLING,
  URL_BILLING_MAIN,
  URL_COMMERCIAL,
  URL_COMMERCIAL_EDIT,
  URL_COMMERCIAL_MAIN,
  URL_DISPATCH,
  URL_DISPATCH_MAIN,
  URL_ORDERS,
  URL_PRODUCTION,
  URL_PRODUCTION_MAIN,
} from '../../../../../globals';

@Component({
  selector: 'app-order-action-buttons',
  templateUrl: './order-action-buttons.component.html',
  styleUrls: ['./order-action-buttons.component.scss'],
  imports: [
    NgIf,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgClass,
  ],
})
export class OrderActionButtonsComponent implements OnInit {
  // Keep core component properties
  @Input() screenType: string = '';
  @Input() title: string = '';

  private readonly state = computed(() => this.orderService.getState()());
  private readonly order = computed(() => this.state().order);
  private readonly isFormValid = computed(() => this.state().isFormValid);

  // UI state
  public isSaving = false;
  public showNext = false;
  public showSave = false;
  public showCancel = false;
  public isObservationsValid = true;

  private readonly dialog: MatDialog = inject(MatDialog);

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  private readonly orderBasicService: DeliveryOrderBasicService = inject(
    DeliveryOrderBasicService,
  );
  private readonly productService: ProductService = inject(ProductService);
  private readonly toastrService: ToastrService = inject(ToastrService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly SCREEN_TYPE_CREATE = SCREEN_TYPE_CREATE;

  constructor(private readonly cdr: ChangeDetectorRef) {
    effect(() => {
      // React to state changes
      const order = this.order();

      if (order) {
        this.setShowButtons();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.setShowButtons();
  }

  private setShowButtons() {
    // Retrieve the current order and its status
    const currentOrder = this.order();
    if (!currentOrder) return;

    // Assign button visibility flags
    this.showSave = this.shouldShowSave();
    this.showNext = this.shouldShowNext();
    this.showCancel = this.shouldShowCancel();
  }
  private shouldShowSave(): boolean {
    const currentOrder = this.order();
    if (!currentOrder) return false;

    const isFinished = currentOrder.isFinished;
    const hasProducts = (currentOrder.productOrders || []).length > 0;
    const isEdit = isScreenEdit(this.screenType);
    const isProductionView =
      this.screenType === SCREEN_TYPE_VIEW_PRODUCTION &&
      !!currentOrder.isProduction;

    return !isFinished && hasProducts && (isEdit || isProductionView);
  }

  private shouldShowNext(): boolean {
    const currentOrder = this.order();
    const orderStatus = currentOrder?.status?.name;
    if (!orderStatus) return false;

    // For production view, show Next if order is pending or finished in production context
    if (this.screenType === SCREEN_TYPE_VIEW_PRODUCTION) {
      const isPending = orderStatus === EStatus.PENDING;
      const isFinishedProduction =
        orderStatus === EStatus.PRODUCTION && currentOrder?.isFinished;
      return Boolean(isPending || isFinishedProduction);
    }

    // For dispatch view, show Next only if the order is finished and not delivered
    if (this.screenType === SCREEN_TYPE_VIEW_DISPATCH) {
      const isFinishedAndNotDelivered =
        orderStatus === EStatus.FINISHED && !currentOrder?.isDelivered;
      return isFinishedAndNotDelivered;
    }

    return false;
  }

  private shouldShowCancel(): boolean {
    const orderStatus = this.order()?.status?.name;
    if (!orderStatus) return false;

    const isFinished = isFinishedStatus(orderStatus);

    return !isFinished && this.screenType === SCREEN_TYPE_EDIT;
  }

  isSaveButtonDisabled(): boolean {
    return this.isSaving || !this.isFormValid() || !this.order();
  }

  async onSaveForm() {
    // Get latest delivery order from state
    const order = this.order();

    if (!order) return;

    // Validate form values
    if (!this.isFormValid) {
      this.toastrService.error('El formulario contiene errores', 'Error');
      return;
    }

    try {
      this.orderService.setLoading(true);

      if (this.screenType === SCREEN_TYPE_CREATE) {
        await this.saveDeliveryOrder(order);
      } else {
        await this.updateDeliveryOrder(order);
      }
    } catch (error) {
      this._showErrorSave();
    } finally {
      this.orderService.setLoading(false);
    }
  }

  private async saveDeliveryOrder(order: DeliveryOrder) {
    try {
      // Validate the delivery order first
      if (!this.validateDeliveryOrder(order)) {
        this.toastrService.error('Faltan campos requeridos', 'Error');
        return;
      }

      // Prepare order data for saving
      const orderToSave = this.prepareOrderForSave(order);
      console.log('Order to save:', orderToSave);

      // Validate product orders
      if (!orderToSave.productOrders?.length) {
        this.toastrService.error('Debe agregar al menos un producto', 'Error');
        return;
      }

      // Save the order
      const response = await this.orderService.add(orderToSave);

      // Update UI after successful save
      this.afterSaveForm(response.id!, 'Creado');
    } catch (error) {
      console.error('Error saving delivery order:', error);
      this._showErrorSave();
      throw error;
    }
  }

  // Helper method to prepare order data
  private prepareOrderForSave(order: DeliveryOrder): DeliveryOrder {
    // Destructure to remove id from the spread
    const { id, ...orderWithoutId } = order;

    const preparedOrder: DeliveryOrder = {
      ...orderWithoutId,
      customer: {
        id: order.customer?.id ?? -1,
      },
      branchOffice: {
        id: order.branchOffice?.id ?? -1,
      },
      deliveryZone: {
        id:
          order.deliveryZone?.id ?? order.branchOffice?.deliveryZone?.id ?? -1,
      },
      status: order.status ? { id: order.status.id } : undefined,
      productOrders: order.productOrders.map((order) => ({
        ...order, // Keep all existing values
        product: { id: order.product.id },
        // Ensure numeric values
        amount: Number(order.amount),
        measure1: Number(order.measure1),
        measure2: Number(order.measure2),
        measureDetail: order.measureDetail
          ? { id: order.measureDetail.id }
          : undefined,
        metricUnit: order.metricUnit ? { id: order.metricUnit.id } : undefined,
        observation: order.observation ?? '',
      })),
      generalObservations: order.generalObservations,
    };

    // If deliveryOrder has version or status, then include the id.
    // Otherwise, do not include an id when sending to the backend.
    if (order.version || order.status) {
      return { id, ...preparedOrder };
    } else {
      return preparedOrder;
    }
  }

  private validateDeliveryOrder(deliveryOrder: DeliveryOrder): boolean {
    return !!(
      deliveryOrder.customer?.id &&
      deliveryOrder.branchOffice?.id &&
      deliveryOrder.deliveryZone?.id &&
      deliveryOrder.productOrders?.length > 0
    );
  }

  private _showErrorSave() {
    const mensaje = 'No se pudo guardar la orden, intente nuevamente';
    this.toastrService.error(mensaje, 'Error', {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
    });
  }

  private async updateDeliveryOrder(deliveryOrder: DeliveryOrder) {
    try {
      const response: DeliveryOrder =
        await this.orderService.update(deliveryOrder);
      this.afterSaveForm(response.id!, 'Actualizado');
    } catch (error) {
      this._showErrorSave();
      throw error;
    }
  }

  private afterSaveForm(id: number, action: string) {
    const mensaje = `Se ha ${action} la orden: ${id}`;
    this.toastrService.success(mensaje, action, {
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
    });

    // Asegúrate de resetear el producto actual
    this.productService.reset();

    if (isScreenEdit(this.screenType)) {
      this.router.navigate([URL_ORDERS, URL_COMMERCIAL, URL_COMMERCIAL_EDIT], {
        relativeTo: this.route.root,
        queryParams: { deliveryOrderId: id },
      });
    }
  }

  async onUpdateStatus() {
    const order = this.order();
    if (!order?.id) return;

    this.isSaving = true;

    try {
      this.orderService.setLoading(true);
      const response: DeliveryOrder =
        await this.orderService.advanceOrderStatus(order.id);

      if (response) {
        this.orderService.updateOrderState(response);
        this.afterUpdateStatus();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      this.orderService.setLoading(false);
      this.isSaving = false;
    }
  }

  private afterUpdateStatus() {
    const order = this.order();
    if (!order?.id) return;

    const mensaje = `La orden: ${order.id} ha progresado`;
    this.toastrService.success(mensaje, 'Progreso', {
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
    });
    this.isSaving = false;
  }

  private afterUpdateStatusCancelled() {
    const order = this.order();
    if (!order?.id) return;

    const mensaje = `La orden: ${order.id} ha sido anulada`;
    this.toastrService.success(mensaje, 'Anulación', {
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
    });

    this.orderBasicService.reloadOrders.next(true);
    this.isSaving = false;

    this.router.navigate([URL_ORDERS, URL_COMMERCIAL, URL_COMMERCIAL_MAIN], {
      relativeTo: this.route.root,
    });
  }

  onBack() {
    this.orderBasicService.reloadOrders.next(true);
    const targetURL: string[] = [URL_ORDERS];
    if (this.screenType === SCREEN_TYPE_VIEW_PRODUCTION) {
      targetURL.push(URL_PRODUCTION, URL_PRODUCTION_MAIN);
    } else if (this.screenType === SCREEN_TYPE_VIEW_DISPATCH) {
      targetURL.push(URL_DISPATCH, URL_DISPATCH_MAIN);
    } else if (this.screenType === SCREEN_TYPE_VIEW_BILL) {
      targetURL.push(URL_BILLING, URL_BILLING_MAIN);
    } else if (isScreenEdit(this.screenType)) {
      targetURL.push(URL_COMMERCIAL, URL_COMMERCIAL_MAIN);
    }
    this.router.navigate(targetURL, { relativeTo: this.route.root });
  }

  async onCancelOrder() {
    const order = this.order();
    if (!this.showCancel || !order?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Está seguro?',
        message: `Estas a punto de anular la orden: ${order.id}`,
      },
    });
    const dialogResult = await firstValueFrom(dialogRef.afterClosed());
    if (!dialogResult) return;

    this.isSaving = true;
    this.orderService.setLoading(true);

    try {
      const response = await this.orderService.toggleCancelled(order.id);
      if (response) {
        const updatedOrder = await this.orderService.findByIdResponse(order.id);
        this.orderService.updateOrderState(updatedOrder);
        this.afterUpdateStatusCancelled();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      this.toastrService.error('Error al anular la orden');
      this.isSaving = false;
    } finally {
      this.orderService.setLoading(false);
    }
  }
}
