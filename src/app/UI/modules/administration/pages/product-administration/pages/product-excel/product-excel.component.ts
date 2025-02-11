import { Component, inject } from '@angular/core';
import { ProductService } from '../../../../../../../delivery-orders/infrastructure/services/product.service';
import { ExcelComponent } from '../../../../components/excel/excel.component';

@Component({
  selector: 'app-product-excel',
  imports: [ExcelComponent],
  templateUrl: './product-excel.component.html',
  styleUrl: './product-excel.component.scss',
})
export class ProductExcelComponent {
  public productService: ProductService = inject(ProductService);

  constructor() {}

  ngOnInit(): void {}
}
