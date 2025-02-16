import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { GenericNamedBasicGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedBasicGatewayImpl';
import { CustomerBasic } from '../../../domain/models/CustomerBasic';
import { CustomerBasicGateway } from '../../../domain/models/gateways/CustomerBasicGateway';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class CustomerBasicGatewayImpl
  extends GenericNamedBasicGatewayImpl<CustomerBasic>
  implements CustomerBasicGateway
{
  constructor() {
    super('/customer-basic');
  }
  findByEmail(
    email: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ):
    | Observable<ApiResponse<CustomerBasic>>
    | Promise<ApiResponse<CustomerBasic>> {
    let queryParams = new HttpParams()
      .set('email', email)
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    const request = this.httpClient
      .get<ApiResponse<CustomerBasic>>(
        `${this.API_URL}${this.localEndpoint}/find/email`,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<CustomerBasic>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in findByEmail:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ):
    | Observable<ApiResponse<CustomerBasic>>
    | Promise<ApiResponse<CustomerBasic>> {
    let queryParams = new HttpParams()
      .set('documentNumber', documentNumber)
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    const request = this.httpClient
      .get<ApiResponse<CustomerBasic>>(
        `${this.API_URL}${this.localEndpoint}/find/documentNumber`,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<CustomerBasic>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in findByDocumentNumber:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
