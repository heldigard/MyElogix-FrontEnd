import { NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SCREEN_TYPE_VIEW_BILL, SCREEN_TYPE_VIEW_PRODUCTION } from '@globals';
import moment from 'moment';
import { BranchOffice } from '../../../../../customers/domain/models/BranchOffice';
import { ContactPerson } from '../../../../../customers/domain/models/ContactPerson';
import { EMembership } from '../../../../../customers/domain/models/EMembership';
import { Membership } from '../../../../../customers/domain/models/Membership';
import { EStatus } from '../../../../../delivery-orders/domain/models/EStatus';
import { DeliveryOrder } from '../../../../../delivery_order/domain/model/DeliveryOrder';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';

@Component({
  selector: 'app-order-customer-info',
  templateUrl: './order-customer-info.component.html',
  styleUrls: ['./order-customer-info.component.scss'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', density: 'compact' },
    },
  ],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgOptimizedImage,
    NgClass,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
  ],
})
export class OrderCustomerInfoComponent implements OnInit {
  @Input() public screenType!: string;
  public orderForm!: FormGroup;
  public imgForMembership!: string;
  public deliveryZoneNameClass: string = 'deliveredZoneName';

  private readonly state = computed(() => this.orderService.getState()());
  protected readonly order = computed(() => this.state().order);
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  protected readonly EStatus = EStatus;
  protected readonly SCREEN_TYPE_VIEW_PRODUCTION = SCREEN_TYPE_VIEW_PRODUCTION;
  protected readonly SCREEN_TYPE_VIEW_BILL = SCREEN_TYPE_VIEW_BILL;

  constructor() {
    this.orderForm = this.getNewOrderForm();
    // Replace subscription with effect
    effect(() => {
      // Obtener el estado actual
      const currentOrder = this.order();

      // Solo proceder si hay una orden válida
      if (currentOrder) {
        // Actualizar los campos del formulario con la nueva orden
        this.setFormFields(currentOrder);

        // Actualizar el ícono de membresía si existe
        if (currentOrder.customer?.membership) {
          this.setIconMembership(currentOrder.customer.membership);
        } else {
          // Limpiar el ícono si no hay membresía
          this.imgForMembership = '';
        }
      }
    });
  }

  ngOnInit() {
    this.orderForm = this.getNewOrderForm();
    // Only call setFormFields if order exists
    const currentOrder = this.order();
    if (currentOrder) {
      this.setFormFields(currentOrder);
    }
  }

  // In order-customer-info.component.ts

  setFormFields(order?: DeliveryOrder) {
    if (!order) return;

    // Set status only if it exists
    if (order.status) {
      this.orderForm.get('status')?.setValue(order.status);
    }

    // Set date only if createdAt exists
    if (order.createdAt) {
      this.setDate(order.createdAt);
    }

    // Set branch office info if it exists
    if (order.branchOffice) {
      this.setFieldsFromBranchOffice(order.branchOffice);
    }

    // Set customer name if it exists
    if (order.customer?.name) {
      this.orderForm.get('customer.name')?.setValue(order.customer.name);
    }

    // Set delivery zone info if it exists
    if (order.deliveryZone) {
      const deliveryZoneName = order.deliveryZone.name;
      this.orderForm.get('deliveryZoneBasic.name')?.setValue(deliveryZoneName);

      if (deliveryZoneName === 'RECOGE' || deliveryZoneName === 'ENVIA') {
        this.deliveryZoneNameClass = 'deliveredZoneNameImportant';
      }
    }
  }

  setDate(date: Date) {
    this.orderForm
      .get('createdAt.date')
      ?.setValue(moment(date).format('MM/DD/YYYY'));
    this.orderForm
      .get('createdAt.hour')
      ?.setValue(moment(date).format('HH:mm:ss'));
  }

  onBranchOfficeSelectionChange($event: MatSelectChange) {
    const id = $event.value;
    const currentOrder = this.order();
    if (id >= 0 && currentOrder?.branchOffice?.id != id) {
      this.setBranchOfficeToDeliveryOrder(id);

      if (currentOrder?.branchOffice)
        this.setFieldsFromBranchOffice(currentOrder?.branchOffice);
    }
  }

  private setFieldsFromBranchOffice(branchOffice: BranchOffice) {
    // Update form fields
    this.orderForm.get('branchOffice.id')?.setValue(branchOffice.id);
    this.orderForm.get('branchOffice.address')?.setValue(branchOffice.address);

    // If city is missing but exists in neighborhood, update the branchOffice state
    if (!branchOffice.city && branchOffice.neighborhood?.city) {
      const updatedBranchOffice = {
        ...branchOffice,
        city: branchOffice.neighborhood.city,
      };

      // Update state through DeliveryOrderService
      this.orderService.updateBranchOfficeInCurrentOrder(branchOffice);

      // Update form with city info
      this.orderForm.get('city.name')?.setValue(updatedBranchOffice.city.name);
    } else if (branchOffice.city) {
      this.orderForm.get('city.name')?.setValue(branchOffice.city.name);
    }

    // Update neighborhood info
    if (branchOffice.neighborhood) {
      this.orderForm
        .get('neighborhood.name')
        ?.setValue(branchOffice.neighborhood.name);
    }

    // Update contact person info
    if (branchOffice.contactPerson) {
      this.setContactPerson(branchOffice.contactPerson);
    }
  }

  private setBranchOfficeToDeliveryOrder(id: number) {
    const currentOrder = this.order();
    if (!currentOrder?.customer?.branchOfficeList) {
      return;
    }

    const office = currentOrder.customer.branchOfficeList.find(
      (office) => office.id === id,
    );

    if (!office || currentOrder.branchOffice?.id === office.id) {
      return;
    }

    const zone = office.deliveryZone ?? office.neighborhood?.deliveryZone;
    if (zone) {
      this.orderService.updateZoneInCurrentOrder(zone);
    }
  }

  private setContactPerson(contactPerson: ContactPerson) {
    if (contactPerson && contactPerson.id! >= 0) {
      this.orderForm
        .get('branchOffice.contactPerson.name')
        ?.setValue(contactPerson.name);
      this.orderForm
        .get('branchOffice.contactPerson.mobileNumberPrimary')
        ?.setValue(contactPerson.mobileNumberPrimary);
      this.orderForm
        .get('branchOffice.contactPerson.mobileNumberSecondary')
        ?.setValue(contactPerson.mobileNumberSecondary);
    }
  }

  private setIconMembership(membership: Membership) {
    switch (membership.name) {
      case EMembership.BRONZE:
        this.imgForMembership = 'assets/icons/bronze-icon.png';
        break;
      case EMembership.SILVER:
        this.imgForMembership = 'assets/icons/silver-icon.png';
        break;
      case EMembership.GOLD:
        this.imgForMembership = 'assets/icons/gold-icon.png';
        break;
      case EMembership.PLATINUM:
        this.imgForMembership = 'assets/icons/platinum-icon.png';
        break;
      case EMembership.DIAMOND:
        this.imgForMembership = 'assets/icons/diamond-icon.png';
        break;
    }
  }

  getNewOrderForm(): FormGroup {
    let formBuilder: FormBuilder = new FormBuilder();
    return formBuilder.group({
      createdAt: formBuilder.group({
        date: [''],
        hour: [''],
      }),
      customer: formBuilder.group({
        name: [''],
      }),
      branchOffice: formBuilder.group({
        id: [''],
        address: ['', Validators.required],
        contactPerson: formBuilder.group({
          name: [''],
          mobileNumberPrimary: [''],
          mobileNumberSecondary: [''],
        }),
      }),
      city: formBuilder.group({
        name: [''],
      }),
      neighborhood: formBuilder.group({
        name: [''],
      }),
      deliveryZoneBasic: formBuilder.group({
        name: ['', Validators.required],
      }),
      status: [''],
    });
  }
}
