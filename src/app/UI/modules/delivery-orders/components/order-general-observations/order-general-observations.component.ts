import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
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
  ],
})
export class OrderGeneralObservationsComponent implements OnInit, OnDestroy {
  private readonly state = computed(() => this.orderService.getState()());
  private readonly order = computed(() => this.state().order);
  public form!: FormGroup;
  public currentText!: string;
  public formValid = signal(true);
  private previousOrderId: number = -1;

  private _observationClass: string = 'no-left no-right';
  private formSubscription?: Subscription;

  get observationClass(): string {
    return this._observationClass;
  }

  @Input() screenType!: string;
  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;
  @ViewChild('observationField') observationField!: ElementRef;

  public readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  constructor(private readonly _ngZone: NgZone) {
    // Listen to signal changes
    effect(() => {
      const order = this.order();
      if (order) {
        this.reloadDeliveryOrder(order);
      }
    });
  }

  ngOnInit(): void {
    // Initialize form once
    this.form = this.getNewForm();
    this.currentText = '';

    // Get initial value from signal
    const initialOrder = this.order();
    if (initialOrder) {
      this.reloadDeliveryOrder(initialOrder);
    }

    this.formSubscription = this.form.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.validateForm());
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
    this.form.reset();
  }

  getNewForm(): FormGroup {
    let formBuilder: FormBuilder = new FormBuilder();
    return formBuilder.group({
      generalObservations: ['', Validators.maxLength(255)],
    });
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
      this.previousOrderId = order?.id ?? -1;
      this.currentText = '';

      if (order?.generalObservations) {
        const observations = order.generalObservations.toUpperCase();
        this.form.patchValue(
          { generalObservations: observations },
          { emitEvent: false },
        );
        this.currentText = observations;
        this.updateObservationClass(observations);
      }
    }
  }

  protected onObservationInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const text = input.value.toUpperCase();
    this.form.patchValue({ generalObservations: text }, { emitEvent: true });
  }

  private validateForm() {
    if (!this.form.dirty) {
      return;
    }

    const text = (
      this.form.get('generalObservations')?.value || ''
    ).toUpperCase();

    if (text.length > 255) {
      const truncatedText = text.substring(0, 255);
      this.form.patchValue(
        { generalObservations: truncatedText },
        { emitEvent: false },
      );
      return; // Evitar procesamiento adicional si se truncó
    }

    const order = this.order();
    if (order) {
      this.updateObservationClass(text);
      this.currentText = text;
      this.updateObservationsDeliveryOrder(text);
      this.formValid.set(this.form.valid);
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
      if (!order) {
        return;
      }

      const currentObservations = (
        order.generalObservations || ''
      ).toUpperCase();
      const newObservations = text.toUpperCase();

      if (currentObservations === newObservations) {
        return;
      }

      this.orderService.updateGeneralObservationsInCurrentOrder(text.trim());
    } catch (error) {
      console.error('Error updating observations:', error);
    }
  }
}
