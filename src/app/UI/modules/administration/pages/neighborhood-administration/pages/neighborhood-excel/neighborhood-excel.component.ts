import { Component, inject } from '@angular/core';
import { NeighborhoodService } from '../../../../../../../customers/infrastructure/services/neighborhood.service';
import { ExcelComponent } from '../../../../components/excel/excel.component';

@Component({
  selector: 'app-neighborhood-excel',
  imports: [ExcelComponent],
  templateUrl: './neighborhood-excel.component.html',
  styleUrl: './neighborhood-excel.component.scss',
})
export class NeighborhoodExcelComponent {
  public neighborhoodService: NeighborhoodService = inject(NeighborhoodService);

  constructor() {}
}
