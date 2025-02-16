import { inject, Injectable } from '@angular/core';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
import { HttpResponse } from '@angular/common/http';
import { CityService } from '../../../../../customers/infrastructure/services/city.service';

@Injectable({
  providedIn: 'root',
})
export class CityAdministrationService implements IExcelService {
  private readonly cityService: CityService = inject(CityService);

  constructor() {}

  public downloadExcelFile(): Promise<HttpResponse<Blob>> {
    return this.cityService.downloadExcelFile();
  }
  public uploadExcelFile(formData: FormData): Promise<any> {
    return this.cityService.uploadExcelFile(formData);
  }
}
