import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericEntity } from '../model/GenericEntity';
import { GenericBasicGateway } from './GenericBasicGateway';

export abstract class GenericGateway<
  T extends GenericEntity,
> extends GenericBasicGateway<T> {
  abstract add(
    data: T,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  abstract update(
    data: T,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  abstract deleteById(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  abstract downloadExcelFile(options?: {
    asPromise?: boolean;
  }): Observable<HttpResponse<Blob>> | Promise<HttpResponse<Blob>>;
  abstract uploadExcelFile(
    file: File,
    options?: {
      asPromise?: boolean;
    },
  ): Observable<any> | Promise<any>;
}
