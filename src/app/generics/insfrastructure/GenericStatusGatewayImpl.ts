import { HttpParams } from '@angular/common/http';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { EStatus } from '../../delivery-orders/domain/models/EStatus';
import { GenericStatusGateway } from '../domain/gateway/GenericStatusGateway';
import { GenericStatus } from '../domain/model/GenericStatus';
import { ApiResponse } from '../dto/ApiResponse';
import { GenericGatewayImpl } from './GenericGatewayImpl';

export abstract class GenericStatusGatewayImpl<T extends GenericStatus>
  extends GenericGatewayImpl<T>
  implements GenericStatusGateway<T>
{
  constructor(protected override readonly localEndpoint: string) {
    super(localEndpoint);
  }

  updateStatus(
    id: number,
    status: EStatus,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const queryParams = new HttpParams().set('status', status.toString());

    const request = this.httpClient
      .put<ApiResponse<T>>(
        `${this.apiURL}${this.localEndpoint}/${id}/status`,
        null,
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
          console.error('Error in updateStatus:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
