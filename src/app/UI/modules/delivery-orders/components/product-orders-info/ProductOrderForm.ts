import type { FormControl, FormGroup } from '@angular/forms';
import type { EStatus } from '../../../../../delivery-orders/domain/models/EStatus';

export interface ProductOrderForm {
  id: FormControl<number>;
  version?: FormControl<number>;
  product: FormGroup<{
    id: FormControl<number>;
    reference: FormControl<string>;
    description: FormControl<string>;
    type: FormGroup<{
      id: FormControl<number>;
      isMeasurable: FormControl<boolean>;
    }>;
  }>;
  status: FormControl<EStatus>;
  amount: FormControl<number>;
  observation: FormControl<string>;
  measure1?: FormControl<number>;
  measure2?: FormControl<number>;
  metricUnit?: FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
  }>;
  measureDetail?: FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
  }>;
}
