import { HttpResponse } from '@angular/common/http';

export interface IExcelService {
  uploadExcelFile(fileToUpload: File): Promise<any>;
  downloadExcelFile(): Promise<HttpResponse<Blob>>;
}
