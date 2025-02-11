import { computed, inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { EStatus } from '../../delivery-orders/domain/models/EStatus';
import type { MeasureDetail } from '../../delivery-orders/domain/models/MeasureDetail';
import type { MetricUnit } from '../../delivery-orders/domain/models/MetricUnit';
import { Product } from '../../delivery-orders/domain/models/Product';
import { DeliveryOrderService } from '../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { GenericProductionService } from '../../generics/insfrastructure/services/generic-production.service';
import { ConfirmDialogComponent } from '../../UI/shared/components/confirm-dialog/confirm-dialog.component';
import { ProductOrderGateway } from '../domain/gateway/ProductOrderGateway';
import { ProductOrder } from '../domain/model/ProductOrder';
import { ProductOrderUseCase } from '../domain/usecase/ProductOrderUseCase';

@Injectable({
  providedIn: 'root',
})
export class ProductOrderService extends GenericProductionService<
  ProductOrder,
  ProductOrderGateway,
  ProductOrderUseCase
> {
  private isSaving = false;
  private readonly dialog = inject(MatDialog);
  private readonly stateOrder = computed(() => this.orderService.getState()());
  private readonly order = computed(() => this.stateOrder().order);
  // Define the signal
  // Get productOrders from state
  private readonly productOrders = computed(
    () => this.order()?.productOrders ?? [],
  );
  private readonly AMOUNT_VALIDATORS = [Validators.required, Validators.min(1)];
  private readonly DEFAULT_METRIC_UNIT = 'CM';
  private readonly DEFAULT_MEASURE_DETAIL = 'INTERNA';

  private readonly MEASURE1_VALIDATORS = [
    Validators.required,
    Validators.pattern('^[0-9]*(.[0-9]{1,2})?$'),
    Validators.min(0.01), // Prevents zero for measure1
  ];

  private readonly MEASURE2_VALIDATORS = [
    Validators.required,
    Validators.pattern('^[0-9]*(.[0-9]{1,2})?$'),
    Validators.min(0),
  ];

  private readonly MEASURE_DETAIL_VALIDATORS = [
    Validators.required,
    Validators.min(1),
  ];

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  constructor() {
    super(inject(ProductOrderUseCase));
  }

  public updateFormValidity(isValid: boolean): void {
    this.orderService.setState({ isFormValid: isValid });
  }

  public getFormFromProductOrder(productOrder: ProductOrder): FormGroup {
    const formBuilder = new FormBuilder();
    const baseFormGroup = formBuilder.group({
      amount: new FormControl<number>(
        productOrder.amount ?? 0,
        this.AMOUNT_VALIDATORS,
      ),
      observation: new FormControl<string>(productOrder.observation ?? ''),
    });

    if (productOrder.product.type?.isMeasurable) {
      this.addMeasurableControls(baseFormGroup, productOrder);
    }

    return baseFormGroup as FormGroup;
  }

  private addMeasurableControls(
    formGroup: FormGroup,
    productOrder: ProductOrder,
  ): void {
    const formBuilder = new FormBuilder();
    // Only add controls if they don't already exist
    if (!formGroup.contains('measure1')) {
      const control = new FormControl(
        productOrder.measure1,
        this.MEASURE1_VALIDATORS,
      );
      formGroup.addControl('measure1', control);
      if (productOrder.id! < 0) {
        control.markAsTouched(); // Forzar la validación desde el inicio
        control.updateValueAndValidity();
      }
    }

    if (!formGroup.contains('measure2')) {
      const control = new FormControl(
        productOrder.measure2,
        this.MEASURE2_VALIDATORS,
      );
      formGroup.addControl('measure2', control);
    }

    if (!formGroup.contains('metricUnit')) {
      formGroup.addControl(
        'metricUnit',
        formBuilder.group({
          id: [productOrder.metricUnit?.id, this.MEASURE_DETAIL_VALIDATORS],
          name: [productOrder.metricUnit?.name],
        }),
      );
    }

    if (!formGroup.contains('measureDetail')) {
      formGroup.addControl(
        'measureDetail',
        formBuilder.group({
          id: [productOrder.measureDetail?.id, this.MEASURE_DETAIL_VALIDATORS],
          name: [productOrder.measureDetail?.name],
        }),
      );
    }
  }

  public override getBlank(): ProductOrder {
    return {
      product: {},
    };
  }

  public getProductOrders(): ProductOrder[] {
    return this.productOrders();
  }

  public getProductOrdersLength(): number {
    return this.productOrders.length;
  }

  onAddProduct(
    product: Product,
    units: MetricUnit[],
    measures: MeasureDetail[],
  ): void {
    if (!product) {
      return console.error('Product is required');
    }

    if (this.isSaving) {
      return console.error('Operation in progress');
    }

    this.isSaving = true;

    try {
      const baseOrder: ProductOrder = {
        product: {
          ...product,
          type: {
            id: product.type?.id ?? 0,
            isMeasurable: product.type?.isMeasurable ?? false,
            name: product.type?.name ?? '',
          },
        },
        amount: 1,
        observation: '',
        status: {
          id: 2,
          name: EStatus.PENDING,
          description: 'pendiente',
        },
      };

      const order = product.type?.isMeasurable
        ? {
            ...baseOrder,
            measure1: 0,
            measure2: 0,
            metricUnit: this.getDefaultMetricUnit(units),
            measureDetail: this.getDefaultMeasureDetail(measures),
          }
        : baseOrder;

      this.addProductOrder(order);
    } catch (error) {
      return console.error('Error adding product order:', error);
    } finally {
      this.isSaving = false;
    }
  }

  private getDefaultMetricUnit(units: MetricUnit[]): MetricUnit {
    if (units.length === 0) {
      throw new Error('No metric units available');
    }

    const defaultUnit = units.find(
      (metricUnit: MetricUnit) =>
        metricUnit.name?.toUpperCase() === this.DEFAULT_METRIC_UNIT,
    );

    return defaultUnit || units[0];
  }

  private getDefaultMeasureDetail(measures: MeasureDetail[]): MeasureDetail {
    if (measures.length === 0) {
      throw new Error('No measure details available');
    }

    const defaultDetail = measures.find(
      (measureDetail: MeasureDetail) =>
        measureDetail.name?.toUpperCase() === this.DEFAULT_MEASURE_DETAIL,
    );

    return defaultDetail || measures[0];
  }

  // Method to update state when product orders change
  private updateProductOrders(updatedOrders: ProductOrder[]) {
    const order = this.order();
    if (!order) return;

    this.orderService.updateOrderState({
      ...order,
      productOrders: updatedOrders,
    });
  }

  // Method to update a single product order
  public updateProductOrder(updatedOrder: ProductOrder) {
    const orders = this.productOrders();
    const index = orders.findIndex(
      (order) => order.product.id === updatedOrder.product.id,
    );

    if (index === -1) {
      console.warn('Product order not found', updatedOrder);
      return;
    }

    const existingOrder = orders[index];
    const newOrder: ProductOrder = { ...existingOrder, ...updatedOrder };

    // Crear un nuevo array de orders con la orden actualizada
    const updatedOrders = orders.map((order, i) =>
      i === index ? newOrder : order,
    );

    this.updateProductOrders(updatedOrders);
  }

  // Method to add a new product order
  public addProductOrder(newOrder: ProductOrder) {
    const orders = [...this.productOrders(), newOrder];
    this.updateProductOrders(orders);
  }

  // Method to remove a product order
  private removeProductOrder(order: ProductOrder | number) {
    const orderId = typeof order === 'number' ? order : order.id!; // Get order id
    if (!orderId) {
      // Remove new product order
      if (typeof order !== 'number') {
        this.removeNewProductOrder(order);
      }
      return;
    }
    const orders = this.productOrders().filter((order) => order.id !== orderId);
    this.updateProductOrders(orders);
  }

  // For handling product order updates
  onProductOrderUpdate({
    index,
    changes,
  }: {
    index: number;
    changes: any;
  }): void {
    const order = this.order();
    if (!order) return;

    // Crear un nuevo array con la orden actualizada
    const updatedOrders = order.productOrders.map((order, i) => {
      if (i === index) {
        // Crear nuevo objeto para el order actualizado
        return {
          ...order,
          ...changes,
        };
      }
      return order;
    });

    // Actualizar el estado con el nuevo array
    this.updateProductOrders(updatedOrders);
  }

  private removeNewProductOrder(productOrder: ProductOrder): void {
    const orders = this.productOrders().filter(
      (po) =>
        !(
          po.product.id === productOrder.product.id &&
          po.amount === productOrder.amount &&
          po.measure1 === productOrder.measure1 &&
          po.measure2 === productOrder.measure2 &&
          po.measureDetail?.id === productOrder.measureDetail?.id
        ),
    );
    this.updateProductOrders(orders);
  }

  // For handling product order removals
  public async onProductOrderRemove(
    productOrder: ProductOrder,
  ): Promise<ProductOrder | void> {
    console.log('onProductOrderRemove', productOrder);
    if (!productOrder || this.isSaving) return;

    if (!productOrder.id) {
      // Use orderService for state updates
      this.removeNewProductOrder(productOrder);
      return;
    }

    const status = this.order()?.status?.name;

    if (status === EStatus.PRODUCTION) {
      // For existing product orders
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Está seguro?',
          message: 'Estas a punto de eliminar un producto del pedido.',
        },
      });

      const result = await firstValueFrom(dialogRef.afterClosed());
      if (!result) return;

      try {
        return await this.cancelProductOrder(productOrder.id, true);
      } catch (error) {
        console.error('Error removing product order:', error);
      }
    } else if (status === EStatus.PENDING) {
      try {
        this.removeProductOrder(productOrder.id);
        return await this.cancelProductOrder(productOrder.id, false);
      } catch (error) {
        console.error('Error removing product order:', error);
      }
    }
  }

  async cancelProductOrder(
    orderId: number,
    shouldUpdate: boolean = true,
  ): Promise<ProductOrder | void> {
    this.isSaving = true;
    try {
      const updated = await this.toggleCancelled(orderId);
      if (updated && shouldUpdate) {
        // Notifica a los suscriptores con la orden actualizada
        this.updateProductOrder(updated);
        return updated;
      }
    } catch (error) {
      console.error('Error al cancelar la orden de producto:', error);
    } finally {
      this.isSaving = false;
    }
  }

  getBackgroundClass(order: ProductOrder): string {
    if (!order) return '';

    if (this.order()?.isCancelled) {
      return 'bg-cancelled';
    }

    if (order.isFinished) return 'bg-finished';
    if (order.isCancelled) return 'bg-cancelled';
    if (order.isDelivered) return 'bg-dispatched';
    return 'bg-pending';
  }

  public override getForm(): FormGroup {
    return new FormGroup({
      amount: new FormControl(null, this.AMOUNT_VALIDATORS),
      metricUnit: new FormControl(this.DEFAULT_METRIC_UNIT),
      measure1: new FormControl(null, this.MEASURE1_VALIDATORS),
      measure2: new FormControl(null, this.MEASURE2_VALIDATORS),
      measureDetail: new FormControl(this.DEFAULT_MEASURE_DETAIL),
      observation: new FormControl(null),
    });
  }

  getStrikethrough(order: ProductOrder): string {
    return order?.isCancelled ? 'line-through' : 'none';
  }

  getIndex(order: ProductOrder): number {
    return this.productOrders().indexOf(order);
  }
}
