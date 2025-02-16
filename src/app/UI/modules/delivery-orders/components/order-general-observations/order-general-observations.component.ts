import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  NgZone,
  type OnDestroy,
  type OnInit,
  signal,
  ViewChild,
  type ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatFormFieldModule,
  type MatFormFieldAppearance,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  isEditObservation,
  isFinishedDeliveryOrder,
  isScreenView,
} from '@shared';
import {
  debounceTime,
  distinctUntilChanged,
  take,
  tap,
  type Subscription,
} from 'rxjs';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { type DeliveryOrder } from '../../../../../delivery_order/domain/model/DeliveryOrder';

@Component({
  selector: 'app-order-general-observations',
  templateUrl: './order-general-observations.component.html',
  styleUrls: ['./order-general-observations.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    NgClass,
    NgIf,
  ],
})
export class OrderGeneralObservationsComponent implements OnInit, OnDestroy {
  private readonly state = computed(() => this.orderService.getState()());
  private readonly order = computed(() => this.state().order);
  public form!: FormGroup;
  public formValid = signal(true);
  private previousOrderId: number | undefined = undefined;
  private _observationClass: string = 'no-left no-right';
  // Derive observations directly from order
  private readonly observations = computed(() =>
    (this.order()?.generalObservations ?? '').toUpperCase(),
  );
  public readonly processedObservations = computed(() => {
    const value = this.observations();
    // Validate length and update class here
    if (value.length > 255) {
      const truncatedText = value.substring(0, 255);
      this.updateObservationClass(truncatedText);
      return truncatedText;
    }
    this.updateObservationClass(value);
    return value;
  });
  get observationClass(): string {
    return this._observationClass;
  }

  @Input() screenType!: string;
  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;
  @ViewChild('observationField') observationField!: ElementRef;

  public readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  constructor(private readonly _ngZone: NgZone) {
    // Listen to order changes
    effect(() => {
      const order = this.order();
      if (order?.customer?.id) {
        this.reloadDeliveryOrder(order);
      }
    });

    // Handle processed observations changes
    effect(() => {
      const value = this.processedObservations();

      // Update form if needed
      if (this.form?.get('generalObservations')?.value !== value) {
        this.form?.patchValue(
          { generalObservations: value },
          { emitEvent: false },
        );
      }

      // Update delivery order if needed
      this.updateObservationsDeliveryOrder(value);
    });
  }

  ngOnInit(): void {
    this.form = this.getNewForm();
    const initialOrder = this.order();
    if (initialOrder) {
      this.reloadDeliveryOrder(initialOrder);
    }
  }

  ngOnDestroy() {
    this.form.reset();
  }

  getNewForm(): FormGroup {
    const formBuilder: FormBuilder = new FormBuilder();
    const form = formBuilder.group({
      generalObservations: ['', Validators.maxLength(255)],
    });
    return form;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize?.resizeToFitContent(true));
  }

  protected getObservationAppearance(): MatFormFieldAppearance {
    const isFinished = isFinishedDeliveryOrder(this.order() ?? undefined);
    if (this.order() && isFinished) {
      return 'outline';
    }
    return 'fill';
  }

  private reloadDeliveryOrder(order: DeliveryOrder) {
    if (order?.id !== this.previousOrderId) {
      this.form = this.getNewForm();
      this.previousOrderId = order?.id;

      if (order?.generalObservations) {
        const observations = order.generalObservations.toUpperCase();
        this.form.patchValue(
          { generalObservations: observations },
          { emitEvent: false },
        );
      }
    }
  }

  protected onObservationInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    let text = input.value.toUpperCase(); // Convertir a mayúsculas

    // Truncar si excede 255 caracteres
    if (text.length > 255) {
      text = text.substring(0, 255);
      input.value = text; // Actualizar el valor del textarea
    }

    // Actualizar el control del formulario
    const control = this.form.get('generalObservations');
    if (control) {
      control.setValue(text, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();

      // Actualizar el state a través del servicio
      this.updateObservationsDeliveryOrder(text);

      // Actualizar la clase para el estilo en negrita
      this.updateObservationClass(text);
    }
  }

  private updateObservationClass(text: string): void {
    if (text.length > 0) {
      this._observationClass = isScreenView(this.screenType)
        ? 'no-left no-right bold-text hide-label background-white animated-border'
        : 'no-left no-right bold-text hide-label background-white';
    } else {
      this._observationClass = 'no-left no-right';
    }
  }

  get isEditableObservation(): boolean {
    return isEditObservation(this.order(), this.screenType) ?? false;
  }

  updateObservationsDeliveryOrder(text: string): void {
    try {
      const order = this.order();
      const currentObservations = (
        order.generalObservations ?? ''
      ).toUpperCase();
      const newObservations = text.toUpperCase();

      if (currentObservations === newObservations) {
        return;
      }

      this.orderService.updateGeneralObservationsInCurrentOrder(text);
    } catch (error) {
      console.error('Error updating observations:', error);
    }
  }
}
