import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { GenericBasicGatewayImpl } from '../../../../generics/insfrastructure/GenericBasicGatewayImpl';
import { EStatus } from '../../../domain/models/EStatus';
import { StatusGateway } from '../../../domain/models/gateways/StatusGateway';
import { Status } from '../../../domain/models/Status';

@Injectable({
  providedIn: 'root',
})
export class StatusGatewayImpl
  extends GenericBasicGatewayImpl<Status>
  implements StatusGateway
{
  constructor() {
    super('/status');
  }

  findByName(
    name: EStatus,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Status>> | Promise<ApiResponse<Status>> {
    const endpoint = this.localEndpoint + '/search/name';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('name', name);
    if (options?.includeDeleted) {
      queryParams = queryParams.append(
        'includeDeleted',
        options.includeDeleted,
      );
    }

    const request = this.httpClient.get<ApiResponse<Status>>(endpoint, {
      params: queryParams,
    });

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findByNameIn(
    names: EStatus[],
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Status>> | Promise<ApiResponse<Status>> {
    const endpoint = this.localEndpoint + '/search/name/batch';
    let queryParams = new HttpParams();
    names.forEach((name) => {
      queryParams = queryParams.append('names', name);
    });
    if (options?.includeDeleted) {
      queryParams = queryParams.append(
        'includeDeleted',
        options.includeDeleted,
      );
    }

    const request = this.httpClient.get<ApiResponse<Status>>(endpoint, {
      params: queryParams,
    });

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
