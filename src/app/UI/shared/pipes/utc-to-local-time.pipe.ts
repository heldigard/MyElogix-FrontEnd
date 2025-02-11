import { Pipe, PipeTransform } from '@angular/core';
import { UtcConverterService } from '../services/utc-converter.service';

@Pipe({
    name: 'utcToLocalTime',
    standalone: true,
})
export class UtcToLocalTimePipe implements PipeTransform {
  constructor(private _dateConverter: UtcConverterService) {}

  transform(date: string, args?: any): string {
    // @ts-ignore
    return this._dateConverter.convertUtcToLocalTime(date, args);
  }
}
