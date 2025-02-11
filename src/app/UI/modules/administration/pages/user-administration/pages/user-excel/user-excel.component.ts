import { Component, inject } from '@angular/core';
import { UserModelService } from '../../../../../../../users/infrastructure/services/user-model.service';
import { ExcelComponent } from '../../../../components/excel/excel.component';

@Component({
  selector: 'app-user-excel',
  imports: [ExcelComponent],
  templateUrl: './user-excel.component.html',
  styleUrl: './user-excel.component.scss',
})
export class UserExcelComponent {
  public userService: UserModelService = inject(UserModelService);

  constructor() {}
}
