import { Component, inject } from '@angular/core';
import { ExcelComponent } from '../../../../components/excel/excel.component';
import { CityService } from '../../../../../../../customers/infrastructure/services/city.service'


@Component({
    selector: 'app-city-excel',
    imports: [ExcelComponent],
    templateUrl: './city-excel.component.html',
    styleUrl: './city-excel.component.scss'
})
export class CityExcelComponent {
  public cityService: CityService = inject(CityService);

  constructor() {}
}
