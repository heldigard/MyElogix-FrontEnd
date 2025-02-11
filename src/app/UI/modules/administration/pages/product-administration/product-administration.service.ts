import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductService } from '../../../../../delivery-orders/infrastructure/services/product.service';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
@Injectable({
  providedIn: 'root',
})
export class ProductAdministrationService implements IExcelService {
  private _productService: ProductService = inject(ProductService);

  constructor() {}

  public downloadExcelFile(): Promise<HttpResponse<Blob>> {
    return this._productService.downloadExcelFile();
  }
  public uploadExcelFile(file: File): Promise<any> {
    return this._productService.uploadExcelFile(file);
  }
}
