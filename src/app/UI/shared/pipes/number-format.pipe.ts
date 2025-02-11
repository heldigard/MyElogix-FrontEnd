import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true,
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value ? value.toLocaleString('es-CO') : '';
  }
}
