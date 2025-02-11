import { inject, Injectable } from '@angular/core';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
import { HttpResponse } from '@angular/common/http';
import { NeighborhoodService } from '../../services/neighborhood.service';
@Injectable({
  providedIn: 'root',
})
export class NeighborhoodAdministrationService implements IExcelService {
  private _neighborhoodService: NeighborhoodService =
    inject(NeighborhoodService);

  constructor() {}

  public downloadExcelFile(): Promise<HttpResponse<Blob>> {
    return this._neighborhoodService.downloadExcelFile();
  }
  public uploadExcelFile(file: File): Promise<any> {
    return this._neighborhoodService.uploadExcelFile(file);
  }
}
