import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { GenericGatewayImpl } from '../../../../generics/insfrastructure/GenericGatewayImpl';
import { MembershipGateway } from '../../../domain/models/gateways/MembershipGateway';
import { Membership } from '../../../domain/models/Membership';

@Injectable({
  providedIn: 'root',
})
export class MembershipGatewayImpl
  extends GenericGatewayImpl<Membership>
  implements MembershipGateway
{
  constructor() {
    super('/membership');
  }

  deleteByName(
    name: string,
    options: { asPromise?: boolean; includeDeleted?: boolean },
  ): Observable<ApiResponse<Membership>> | Promise<ApiResponse<Membership>> {
    let queryParams = new HttpParams();

    if (options.includeDeleted) {
      queryParams = queryParams.append(
        'includeDeleted',
        options.includeDeleted.toString(),
      );
    }

    const request = this.httpClient.delete<ApiResponse<Membership>>(
      `${this.apiURL}${this.localEndpoint}/name/${name}`,
      {
        params: queryParams,
      },
    );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findByName(
    name: string,
    options: { asPromise?: boolean; includeDeleted?: boolean } = {},
  ): Observable<ApiResponse<Membership>> | Promise<ApiResponse<Membership>> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('name', name);

    if (options.includeDeleted) {
      queryParams = queryParams.append(
        'includeDeleted',
        options.includeDeleted.toString(),
      );
    }

    const request = this.httpClient.get<ApiResponse<Membership>>(
      `${this.apiURL}${this.localEndpoint}/search/name`,
      {
        params: queryParams,
      },
    );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
