import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { GenericProductionGateway } from '../domain/gateway/GenericProductionGateway';
import { GenericProduction } from '../domain/model/GenericProduction';
import { ApiResponse } from '../dto/ApiResponse';
import { GenericStatusGatewayImpl } from './GenericStatusGatewayImpl';

export abstract class GenericProductionGatewayImpl<T extends GenericProduction>
  extends GenericStatusGatewayImpl<T>
  implements GenericProductionGateway<T>
{
  constructor(protected override readonly localEndpoint: string) {
    super(localEndpoint);
  }

  advanceOrderStatus(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .put<
        ApiResponse<T>
      >(`${this.API_URL}${this.localEndpoint}/status/advance/${id}`, null)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in advanceOrderStatus:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  batchAdvanceOrderStatus(
    idList: number[],
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .put<
        ApiResponse<T>
      >(`${this.API_URL}${this.localEndpoint}/status/advance/batch`, idList)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in batchAdvanceOrderStatus:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  toggleCancelled(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .put<
        ApiResponse<T>
      >(`${this.API_URL}${this.localEndpoint}/${id}/status/cancelled`, null)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in toggleCancelled:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  togglePaused(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const request = this.httpClient
      .put<
        ApiResponse<T>
      >(`${this.API_URL}${this.localEndpoint}/${id}/status/paused`, null)
      .pipe(
        map((response: ApiResponse<T>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in togglePaused:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
