import { DeliveryZone } from '../../customers/domain/models/DeliveryZone';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContactPerson } from '../../customers/domain/models/ContactPerson';
import { City } from '../../customers/domain/models/City';
import { Neighborhood } from '../../customers/domain/models/Neighborhood';
import { BranchOffice } from '../../customers/domain/models/BranchOffice';

export function getDeliveryZoneForm(deliveryZone: DeliveryZone | undefined) {
  const formBuilder: FormBuilder = new FormBuilder();

  if (deliveryZone)
    return formBuilder.group({
      id: [deliveryZone.id, [ValidateIndexSelected]],
      name: [deliveryZone.name],
    });

  return formBuilder.group({
    id: [-1, [ValidateIndexSelected]],
    name: [''],
  });
}

export function getContactPersonForm(contactPerson: ContactPerson | undefined) {
  const formBuilder: FormBuilder = new FormBuilder();
  if (contactPerson)
    return formBuilder.group({
      id: [contactPerson.id],
      name: [
        contactPerson.name ? contactPerson.name : '',
        [Validators.required, Validators.minLength(4)],
      ],
      mobileNumberPrimary: [
        contactPerson.mobileNumberPrimary
          ? contactPerson.mobileNumberPrimary
          : '',
        [ValidatePhone],
      ],
      mobileNumberSecondary: [
        contactPerson.mobileNumberSecondary
          ? contactPerson.mobileNumberSecondary
          : '',
        [ValidatePhone],
      ],
    });

  return formBuilder.group({
    id: [-1],
    name: ['', [Validators.required, Validators.minLength(4)]],
    mobileNumberPrimary: ['', [ValidatePhone]],
    mobileNumberSecondary: ['', [ValidatePhone]],
  });
}

export function getCityForm(city: City | undefined) {
  const formBuilder: FormBuilder = new FormBuilder();

  if (city)
    return formBuilder.group({
      id: [city.id, [ValidateIndexSelected]],
      name: [city.name],
    });

  return formBuilder.group({
    id: [-1, [ValidateIndexSelected]],
    name: [''],
  });
}

export function getNeighborhoodForm(neighborhood: Neighborhood | undefined) {
  const formBuilder: FormBuilder = new FormBuilder();

  if (neighborhood)
    return formBuilder.group({
      id: [neighborhood.id],
      name: [neighborhood.name],
      deliveryZone: getDeliveryZoneForm(neighborhood.deliveryZone),
    });

  return formBuilder.group({
    id: [-1],
    name: [''],
  });
}

export function getBranchOfficeForm(
  branchOffice: BranchOffice | undefined,
): FormGroup {
  const formBuilder: FormBuilder = new FormBuilder();

  return formBuilder.group({
    id: branchOffice ? branchOffice.id : -1,
    address: [
      branchOffice ? branchOffice.address : '',
      [Validators.required, Validators.minLength(4)],
    ],
    contactPerson: getContactPersonForm(branchOffice?.contactPerson),
    city: branchOffice?.city
      ? getCityForm(branchOffice?.city)
      : getCityForm(branchOffice?.neighborhood?.city),
    neighborhood: getNeighborhoodForm(branchOffice?.neighborhood),
    deliveryZone: getDeliveryZoneForm(branchOffice?.deliveryZone),
  });
}

//// Validators ////
export function ValidateIndexSelected(
  control: AbstractControl,
): { [key: string]: any } | null {
  if (control.value && control.value == -1) {
    return { indexInvalid: true };
  }
  return null;
}

export function ValidatePhone(
  control: AbstractControl,
): { [key: string]: any } | null {
  const phoneRegex = /^(?!0{7,10}$)([0-9]{7}|[0-9]{10})$/;
  if (control.value && !phoneRegex.test(control.value)) {
    return { phoneInvalid: true };
  }
  return null;
}
