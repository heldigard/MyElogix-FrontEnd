import { HttpParams } from '@angular/common/http';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { GenericNamedBasicGateway } from '../domain/gateway/GenericNamedBasicGateway';
import { GenericNamedBasic } from '../domain/model/GenericNamedBasic';
import { ApiResponse } from '../dto/ApiResponse';
import { GenericBasicGatewayImpl } from './GenericBasicGatewayImpl';

export abstract class GenericNamedBasicGatewayImpl<T extends GenericNamedBasic>
  extends GenericBasicGatewayImpl<T>
  implements GenericNamedBasicGateway<T>
{
  constructor(protected override readonly localEndpoint: string) {
    super(localEndpoint);
  }

  findByName(
    name: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    let queryParams = new HttpParams()
      .set('name', name)
      .set('includeDeleted', options?.includeDeleted ?? false);

    const request = this.httpClient
      .get<ApiResponse<T>>(`${this.API_URL}${this.localEndpoint}/search/name`, {
        params: queryParams,
      })
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in findByName:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  existsByName(
    name: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    let queryParams = new HttpParams()
      .set('name', name)
      .set('includeDeleted', options?.includeDeleted ?? false);

    const request = this.httpClient
      .get<ApiResponse<T>>(`${this.API_URL}${this.localEndpoint}/exists/name`, {
        params: queryParams,
      })
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in existsByName:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
