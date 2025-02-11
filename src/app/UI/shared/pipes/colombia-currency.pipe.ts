import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'colombiaCurrency',
  // Asegúrate que Angular 17 aún soporte la propiedad 'standalone' si ha sido planeada para una versión futura.
  standalone: true,
})
export class ColombiaCurrencyPipe implements PipeTransform {
  // Se inyecta el CurrencyPipe dentro del constructor para usarlo más adelante en el método transform.
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: number | string, fractionDigits = 2): string {
    // Retornar un valor vacío si 'value' no es válido para evitar errores de ejecución y comportamiento.
    if (value == null) {
      return '';
    }

    // Formatear el valor usando 'CurrencyPipe'.
    // El signo de COP se manejará de acuerdo a la configuración de localización al aplicar 'transform'.
    const formattedValue = this.currencyPipe.transform(
      value,
      'COP', // ISO currency code para la moneda colombiana.
      'symbol-narrow', // Indica que queremos el símbolo de la moneda en su forma más estrecha (por ej., $ en lugar de COP).
      '1.0-' + fractionDigits, // Definir el formato de los dígitos fraccionales como un string, ej. '1.0-2' para dos dígitos.
    );

    // No es necesario convertir el valor en toLocaleString nuevamente ya que CurrencyPipe ya ha formateado el valor.
    // Además, convertir el valor ya formateado a toLocaleString sería ineficaz y podría dar resultados incorrectos.
    return formattedValue || ''; // Retornar el valor ya formateado.
  }
}
