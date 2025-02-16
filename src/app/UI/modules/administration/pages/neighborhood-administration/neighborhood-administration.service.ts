import { inject, Injectable } from '@angular/core';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
import { HttpResponse } from '@angular/common/http';
import { NeighborhoodService } from '../../../../../customers/infrastructure/services/neighborhood.service';

@Injectable({
  providedIn: 'root',
})
export class NeighborhoodAdministrationService implements IExcelService {
  private readonly neighborService: NeighborhoodService =
    inject(NeighborhoodService);

  constructor() {}

  public downloadExcelFile(): Promise<HttpResponse<Blob>> {
    return this.neighborService.downloadExcelFile();
  }
  public uploadExcelFile(formData: FormData): Promise<any> {
    return this.neighborService.uploadExcelFile(formData);
  }
}
