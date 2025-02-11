import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
  standalone: true,
})
export class NumbersOnlyDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^0-9]/g, ''); // Filtra caracteres no numéricos
    input.value = sanitizedValue;
  }
}
