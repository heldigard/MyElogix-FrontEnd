import { HttpParams } from '@angular/common/http';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { GenericNamedGateway } from '../domain/gateway/GenericNamedGateway';
import { GenericNamed } from '../domain/model/GenericNamed';
import { ApiResponse } from '../dto/ApiResponse';
import { GenericGatewayImpl } from './GenericGatewayImpl';

export abstract class GenericNamedGatewayImpl<T extends GenericNamed>
  extends GenericGatewayImpl<T>
  implements GenericNamedGateway<T>
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

  deleteByName(
    name: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    let queryParams = new HttpParams().set(
      'includeDeleted',
      options?.includeDeleted ?? false,
    );

    const request = this.httpClient
      .delete<ApiResponse<T>>(
        `${this.API_URL}${this.localEndpoint}/name/${name}`,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in deleteByName:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
