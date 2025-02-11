import { Directive, DoCheck, inject } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

const _clearValidators = AbstractControl.prototype.clearValidators;
AbstractControl.prototype.clearValidators = function () {
  (this as any).isRequired = false;
  _clearValidators.call(this);
};

const setValidators = AbstractControl.prototype.setValidators;
AbstractControl.prototype.setValidators = function (
  newValidator: ValidatorFn | ValidatorFn[] | null,
): void {
  (this as any).isRequired = false;
  setValidators.call(this, newValidator);
};

export class MatValidators {
  static required(control: AbstractControl): ValidationErrors | null {
    (control as any).isRequired = true;
    return Validators.required(control);
  }
}

@Directive({
  selector:
    '[matInput][formControl]:not([required]), [matInput][formControlName]:not([required])',
  standalone: true,
})
export class MatInputRequired implements DoCheck {
  private readonly input: MatInput = inject(MatInput);

  constructor() {}

  ngDoCheck() {
    const isRequired =
      (this.input.ngControl?.control as any)?.isRequired ?? false;
    if (isRequired !== this.input.required) {
      this.input.required = isRequired;
      this.input.ngOnChanges();
    }
  }
}

@Directive({
  selector:
    'mat-select[formControl]:not([required]), mat-select[formControlName]:not([required])',
  standalone: true,
})
export class MatSelectRequired implements DoCheck {
  private readonly input: MatSelect = inject(MatSelect);

  constructor() {}

  ngDoCheck() {
    const isRequired =
      (this.input.ngControl?.control as any)?.isRequired ?? false;
    if (isRequired !== this.input.required) {
      this.input.required = isRequired;
    }
  }
}
