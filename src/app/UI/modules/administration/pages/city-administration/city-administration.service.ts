import { inject, Injectable } from '@angular/core';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
import { HttpResponse } from '@angular/common/http';
import { CityService } from '../../services/city.service';
@Injectable({
  providedIn: 'root',
})
export class CityAdministrationService implements IExcelService {
  private _cityService: CityService = inject(CityService);

  constructor() {}

  public downloadExcelFile(): Promise<HttpResponse<Blob>> {
    return this._cityService.downloadExcelFile();
  }
  public uploadExcelFile(file: File): Promise<any> {
    return this._cityService.uploadExcelFile(file);
  }
}
