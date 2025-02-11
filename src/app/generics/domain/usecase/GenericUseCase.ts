import type { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericGateway } from '../gateway/GenericGateway';
import { GenericEntity } from '../model/GenericEntity';
import { GenericBasicUseCase } from './GenericBasicUseCase';

export abstract class GenericUseCase<
  T extends GenericEntity,
  G extends GenericGateway<T>,
> extends GenericBasicUseCase<T, G> {
  protected constructor(protected override readonly gateway: G) {
    super(gateway);
  }

  add(
    entity: T,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.add(entity, options);
  }

  update(
    entity: T,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.update(entity, options);
  }

  deleteById(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.deleteById(id, options);
  }

  downloadExcelFile(options?: {
    asPromise?: boolean;
  }): Observable<HttpResponse<Blob>> | Promise<HttpResponse<Blob>> {
    return this.gateway.downloadExcelFile(options);
  }
  uploadExcelFile(
    file: File,
    options?: { asPromise?: boolean },
  ): Observable<any> | Promise<any> {
    return this.gateway.uploadExcelFile(file, options);
  }
}
