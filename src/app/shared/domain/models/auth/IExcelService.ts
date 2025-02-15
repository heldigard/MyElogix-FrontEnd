import { HttpResponse } from '@angular/common/http';
import type { Observable } from 'rxjs';

export interface IExcelService {
  uploadExcelFile(formData: FormData): Observable<any> | Promise<any>;
  downloadExcelFile():
    | Observable<HttpResponse<Blob>>
    | Promise<HttpResponse<Blob>>;
}
