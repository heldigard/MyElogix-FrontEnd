import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  type OnInit,
} from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import {
  MatFormFieldModule,
  type MatFormFieldAppearance,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  isEditObservation,
  isFinishedProductOrder,
  isScreenView,
} from '@shared';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, type Subscription } from 'rxjs';
import { MeasureDetailService } from '../../../../../../../delivery-orders/infrastructure/services/measure-detail.service';
import { MetricUnitService } from '../../../../../../../delivery-orders/infrastructure/services/metric-unit.service';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { ProductOrderService } from '../../../../../../../product-order/infrastructure/product-order.service';
import { AutoFocusDirective } from '../../../../pages/commercial-delivery-order/components/create-edit-order/components/auto-focus.directive';
import { TagDirective } from '../../../../pages/commercial-delivery-order/components/create-edit-order/components/tag.directive';
import { type MeasureDetail } from '../../../../../../../delivery-orders/domain/models/MeasureDetail';
import { type MetricUnit } from '../../../../../../../delivery-orders/domain/models/MetricUnit';
import { type ProductOrder } from '../../../../../../../product-order/domain/model/ProductOrder';

@Component({
  selector: 'app-product-order-fields',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AutoFocusDirective,
    TagDirective,
  ],
  templateUrl: './product-order-fields.component.html',
  styleUrls: ['./product-order-fields.component.scss'],
})
export class ProductOrderFieldsComponent implements OnInit {
  @Input() productOrder!: ProductOrder;
  @Input() screenType!: string;
  @Output() lastFieldEntered = new EventEmitter<void>();
  protected form!: FormGroup;
  private formSubscription?: Subscription;

  private readonly metricUnitService: MetricUnitService =
    inject(MetricUnitService);
  private readonly measureDetailService: MeasureDetailService =
    inject(MeasureDetailService);
  // Change property declarations
  private readonly metricUnits = computed(() => {
    const units = this.metricUnitService.items();
    if (units.length === 0) {
      // Llamada asíncrona para cargar los datos
      this.metricUnitService.fetchAllData().catch((error) => {
        console.error('Error fetching metric units:', error);
      });
    }
    return units;
  });

  get metricUnitList(): MetricUnit[] {
    return this.metricUnits();
  }

  private readonly measureDetails = computed(() => {
    const units = this.measureDetailService.items();
    if (units.length === 0) {
      // Llamada asíncrona para cargar los datos
      this.measureDetailService.fetchAllData().catch((error) => {
        console.error('Error fetching measure details:', error);
      });
    }
    return units;
  });

  get measureDetailList(): MeasureDetail[] {
    return this.measureDetails();
  }

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);
  private readonly productOrderService: ProductOrderService =
    inject(ProductOrderService);
  constructor(private readonly toastrService: ToastrService) {}

  get isFieldReadOnly(): boolean {
    return isScreenView(this.screenType);
  }

  get isEditableObservation(): boolean {
    return isEditObservation(this.order(), this.screenType) ?? false;
  }

  get strikethrough(): string {
    return this.productOrderService.getStrikethrough(this.productOrder);
  }

  get index(): number {
    return this.productOrderService.getIndex(this.productOrder);
  }

  get measurable(): boolean {
    return this.productOrder.product.type?.isMeasurable || false;
  }

  get isLastProductOrder(): boolean {
    const size = this.productOrderService.getProductOrdersLength();
    return this.index === size - 1;
  }

  ngOnInit(): void {
    this.form = this.productOrderService.getFormFromProductOrder(
      this.productOrder,
    );

    // Subscribe to form value changes
    this.formSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300), // Wait for user to stop typing
        distinctUntilChanged(), // Only emit when value actually changes
      )
      .subscribe((formValue) => {
        this.onFormValueChange(formValue);
      });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    this.formSubscription?.unsubscribe();
  }

  private onFormValueChange(formValue: any): void {
    if (!this.form.dirty) return;

    // Validate form before updating
    let isValid = true;
    isValid = this.validateAmount(formValue) && isValid;

    if (this.measurable) {
      isValid = this.validateMeasures(formValue) && isValid;
    }

    if (isValid && this.form.valid) {
      // Create base changes object
      const changes = {
        amount: Number(formValue.amount),
        observation: formValue.observation || '',
      };

      // Add measurable fields if product is measurable
      if (this.measurable) {
        Object.assign(changes, {
          measure1: Number(formValue.measure1),
          measure2: Number(formValue.measure2),
          metricUnit: formValue.metricUnit,
          measureDetail: formValue.measureDetail,
        });
      }

      // Update product order in service
      this.productOrderService.onProductOrderUpdate({
        index: this.index,
        changes,
      });

      // Update form validation state
      this.orderService.setState({
        isFormValid: true,
      });
    } else {
      // Update form validation state
      this.orderService.setState({
        isFormValid: false,
      });
    }
  }

  onUnitSelect(event: any): void {
    const selectedId = event.value;
    const selectedMetricUnit = this.metricUnitList.find(
      (unit) => unit.id === selectedId,
    );
    if (selectedMetricUnit) {
      // Actualiza el formulario con el objeto completo, incluyendo id y name
      this.form.get('metricUnit')?.patchValue({
        id: selectedMetricUnit.id,
        name: selectedMetricUnit.name,
      });
    }
  }

  onMeasureSelect(event: any): void {
    const selectedId = event.value;
    if (selectedId === 7) {
      // Si la medida seleccionada es Varilla, actualizar measure1 y measure2 a 2.90
      this.form.patchValue({
        measure1: 2.9,
        measure2: 2.9,
      });
    }
  }

  disableArrowKeys(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }

  selectInput(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  formatDecimal(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(',', '.');
    input.value = value;
  }

  // Add new method to prevent decimal input
  preventDecimalInput(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  private validateAmount(formValue: any, triggeredField?: string): boolean {
    const amountValue = Number(formValue.amount);
    if (!Number.isInteger(amountValue) || amountValue <= 0) {
      this.form.get('amount')?.setErrors({ invalidAmount: true });
      if (triggeredField === 'amount') {
        this.toastrService.error(
          'La cantidad debe ser un número entero mayor a 0',
          'Error',
        );
      }
      return false;
    }
    return true;
  }

  private validateMeasures(formValue: any, triggeredField?: string): boolean {
    let isValid = true;

    if (
      formValue.measure1 !== undefined &&
      this.productOrder.product.type?.isMeasurable
    ) {
      const measure1 = Number(formValue.measure1);
      if (isNaN(measure1) || measure1 <= 0 || formValue.measure1 === '') {
        this.form.get('measure1')?.setErrors({ invalidMeasure: true });
        if (triggeredField === 'measure1') {
          this.toastrService.error(
            'La medida 1 debe ser un número mayor a 0',
            'Error',
          );
        }
        isValid = false;
      }
    }

    if (
      formValue.measure2 !== undefined &&
      this.productOrder.product.type?.isMeasurable
    ) {
      const measure2 = Number(formValue.measure2);
      if (isNaN(measure2) || measure2 < 0 || formValue.measure2 === '') {
        this.form.get('measure2')?.setErrors({ invalidMeasure: true });
        if (triggeredField === 'measure2') {
          this.toastrService.error(
            'La medida 2 debe ser un número mayor o igual a 0',
            'Error',
          );
        }
        isValid = false;
      }
    }

    return isValid;
  }

  protected onObservationInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    input.value = input.value.toUpperCase();
  }

  // Add helper methods
  protected getObservationAppearance(): MatFormFieldAppearance {
    if (this.productOrder && isFinishedProductOrder(this.productOrder)) {
      return 'outline';
    }
    return 'fill';
  }

  // Update getObservationClass() method
  protected getObservationClass(): string {
    const observation = this.form?.get('observation')?.value;
    if (observation?.length > 0) {
      if (isScreenView(this.screenType)) {
        return 'no-left no-right bold-text hide-label background-white animated-border';
      }
      return 'no-left no-right bold-text hide-label background-white';
    }
    return 'no-left no-right';
  }

  onLastTagReached(): void {
    this.lastFieldEntered.emit();
  }

  private validateForm(triggeredField?: string) {
    // Solo validar si el formulario está marcado como "dirty"
    if (!this.form?.dirty) return;

    const formValue = this.form.value;
    let isValid = true;

    // Validar cantidad
    isValid = this.validateAmount(formValue, triggeredField) && isValid;

    // Validar medidas solo si el producto es medible
    if (this.productOrder.product.type?.isMeasurable) {
      isValid = this.validateMeasures(formValue, triggeredField) && isValid;
    }

    // Si el formulario es válido, actualizar el productOrder en el state
    if (isValid && this.form.valid) {
      // Crear objeto con los cambios
      const changes = {
        amount: Number(formValue.amount),
        observation: formValue.observation || '',
      };

      // Agregar medidas si el producto es medible
      if (this.productOrder.product.type?.isMeasurable) {
        Object.assign(changes, {
          measure1: Number(formValue.measure1),
          measure2: Number(formValue.measure2),
          metricUnit: formValue.metricUnit,
          measureDetail: formValue.measureDetail,
        });
      }

      // Actualizar el productOrder en el servicio
      this.productOrderService.onProductOrderUpdate({
        index: this.index,
        changes,
      });
    }

    // Actualizar el estado de validación del formulario en el DeliveryOrderService
    this.orderService.setState({
      isFormValid: isValid && this.form.valid,
    });
  }

  onFieldBlur(fieldName: string): void {
    this.validateForm(fieldName);
  }

  protected getBackgroundClass(order: ProductOrder): string {
    return this.productOrderService.getBackgroundClass(order);
  }
}
