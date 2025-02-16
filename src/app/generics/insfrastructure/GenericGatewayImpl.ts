import { HttpResponse } from '@angular/common/http';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { GenericGateway } from '../domain/gateway/GenericGateway';
import { GenericEntity } from '../domain/model/GenericEntity';
import { ApiResponse } from '../dto/ApiResponse';
import { GenericBasicGatewayImpl } from './GenericBasicGatewayImpl';

export abstract class GenericGatewayImpl<T extends GenericEntity>
  extends GenericBasicGatewayImpl<T>
  implements GenericGateway<T>
{
  constructor(protected override readonly localEndpoint: string) {
    super(localEndpoint);
  }

  add(
    data: T,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .post<ApiResponse<T>>(`${this.API_URL}${this.localEndpoint}`, data)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in add:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  update(
    data: T,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .put<ApiResponse<T>>(`${this.API_URL}${this.localEndpoint}`, data)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in add:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  deleteById(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .delete<ApiResponse<T>>(`${this.API_URL}${this.localEndpoint}/${id}`)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in deleteById:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  downloadExcelFile(options?: {
    asPromise?: boolean;
  }): Observable<HttpResponse<Blob>> | Promise<HttpResponse<Blob>> {
    const endpoint = this.localEndpoint + '/excel/download';
    const request = this.httpClient.get<Blob>(this.API_URL + endpoint, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  uploadExcelFile(
    formData: FormData,
    options?: { asPromise?: boolean },
  ): Observable<any> | Promise<any> {
    const endpoint = this.localEndpoint + '/excel/upload';
    const request = this.httpClient.post<any>(
      this.API_URL + endpoint,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      },
    );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
