import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductService } from '../../../../../delivery-orders/infrastructure/services/product.service';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
@Injectable({
  providedIn: 'root',
})
export class ProductAdministrationService implements IExcelService {
  private readonly productService: ProductService = inject(ProductService);

  constructor() {}

  public downloadExcelFile(): Promise<HttpResponse<Blob>> {
    return this.productService.downloadExcelFile();
  }
  public uploadExcelFile(formData: FormData): Promise<any> {
    return this.productService.uploadExcelFile(formData);
  }
}
