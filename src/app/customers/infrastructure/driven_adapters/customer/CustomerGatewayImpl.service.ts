import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import type { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { Hits } from '../../../../shared/domain/models/Hits';
import { Customer } from '../../../domain/models/Customer';
import { CustomerGateway } from '../../../domain/models/gateways/CustomerGateway';

@Injectable({
  providedIn: 'root',
})
export class CustomerGatewayImpl
  extends GenericNamedGatewayImpl<Customer>
  implements CustomerGateway
{
  constructor() {
    super('/customer');
  }

  deleteByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    let queryParams = new HttpParams()
      .set('documentNumber', documentNumber)
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    const request = this.httpClient
      .delete<
        ApiResponse<Customer>
      >(`${this.API_URL}${this.localEndpoint}/delete/documentNumber`, { params: queryParams })
      .pipe(
        map((response: ApiResponse<Customer>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in deleteByDocumentNumber:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findAllByOrderByHitsDesc(isDeleted?: boolean): Observable<Array<Customer>> {
    const endpoint = this.localEndpoint + '/find/all/hits/desc';
    let queryParams = new HttpParams();
    if (isDeleted) queryParams = queryParams.append('isDeleted', isDeleted);
    return this.httpClient.get<Array<Customer>>(this.API_URL + endpoint, {
      params: queryParams,
    });
  }

  findByEmail(
    email: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    const endpoint = this.localEndpoint + '/find/email';
    let queryParams = new HttpParams()
      .set('email', email)
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    const request = this.httpClient
      .get<ApiResponse<Customer>>(this.API_URL + endpoint, {
        params: queryParams,
      })
      .pipe(
        map((response: ApiResponse<Customer>) => {
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
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    const endpoint = this.localEndpoint + '/find/documentNumber';
    let queryParams = new HttpParams()
      .set('documentNumber', documentNumber)
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    const request = this.httpClient
      .get<ApiResponse<Customer>>(this.API_URL + endpoint, {
        params: queryParams,
      })
      .pipe(
        map((response: ApiResponse<Customer>) => {
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

  updateHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    const endpoint = this.localEndpoint + '/update/hits';
    let queryParams = new HttpParams().set(
      'includeDeleted',
      options?.includeDeleted?.toString() ?? 'false',
    );

    const request = this.httpClient
      .put<ApiResponse<Customer>>(this.API_URL + endpoint, hits, {
        params: queryParams,
      })
      .pipe(
        map((response: ApiResponse<Customer>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in updateHits:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  incrementHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    const endpoint = this.localEndpoint + '/increment/hits';
    let queryParams = new HttpParams().set(
      'includeDeleted',
      options?.includeDeleted?.toString() ?? 'false',
    );

    const request = this.httpClient
      .put<ApiResponse<Customer>>(this.API_URL + endpoint, hits, {
        params: queryParams,
      })
      .pipe(
        map((response: ApiResponse<Customer>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in incrementHits:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  override uploadExcelFile(formData: FormData): Observable<any> | Promise<any> {
    return super.uploadExcelFile(formData, { asPromise: true }) as Promise<any>;
  }
}
