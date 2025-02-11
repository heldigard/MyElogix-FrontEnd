import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from '../../../../../../../customers/infrastructure/services/customer.service';
import { ExcelComponent } from '../../../../components/excel/excel.component';

@Component({
  selector: 'app-customer-excel',
  imports: [MatInputModule, ReactiveFormsModule, FormsModule, ExcelComponent],
  templateUrl: './customer-excel.component.html',
  styleUrl: './customer-excel.component.scss',
})
export class CustomerExcelComponent {
  public customerService: CustomerService = inject(CustomerService);

  constructor() {}
}
