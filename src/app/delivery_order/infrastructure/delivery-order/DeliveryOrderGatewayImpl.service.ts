import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  throwError,
} from 'rxjs';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { GenericProductionGatewayImpl } from '../../../generics/insfrastructure/GenericProductionGatewayImpl';
import { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../../shared/domain/models/pagination/Sort';
import { DeliveryOrderGateway } from '../../domain/gateway/DeliveryOrderGateway';
import { DeliveryOrder } from '../../domain/model/DeliveryOrder';
import type { DeliveryOrderResponse } from '../../dto/DeliveryOrderResponse';

@Injectable({
  providedIn: 'root',
})
export class DeliveryOrderGatewayImpl
  extends GenericProductionGatewayImpl<DeliveryOrder>
  implements DeliveryOrderGateway
{
  constructor() {
    super('/delivery-order');
  }

  nuevo(
    customerId: number,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>> {
    const request = this.httpClient
      .get<
        ApiResponse<DeliveryOrder>
      >(`${this.API_URL}${this.localEndpoint}/nuevo/${customerId}`)
      .pipe(
        map((response: ApiResponse<DeliveryOrder>) => {
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

  updateIsBilled(
    id: number,
    isBilled: boolean,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>> {
    const queryParams = new HttpParams().set('isBilled', isBilled.toString());

    const request = this.httpClient
      .get<ApiResponse<DeliveryOrder>>(
        `${this.API_URL}${this.localEndpoint}/billing-status/${id}`,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<DeliveryOrder>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in updateIsBilled:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  updateBatchBillingStatus(
    ids: number[],
    isBilled: boolean,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>> {
    const params = new HttpParams()
      .set('isBilled', isBilled.toString())
      .append('ids', ids.join(','));

    const request = this.httpClient
      .put<
        ApiResponse<DeliveryOrder>
      >(`${this.API_URL}${this.localEndpoint}/billing-status/batch`, null, { params })
      .pipe(
        map((response: ApiResponse<DeliveryOrder>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in updateBatchBillingStatus:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findByIdResponse(
    id: number,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>> {
    let queryParams = new HttpParams();

    if (options?.includeDeleted !== undefined) {
      queryParams = queryParams.append(
        'includeDeleted',
        options.includeDeleted.toString(),
      );
    }

    const request = this.httpClient
      .get<
        ApiResponse<DeliveryOrderResponse>
      >(`${this.API_URL}${this.localEndpoint}/${id}/response`, { params: queryParams })
      .pipe(
        catchError((error) => {
          console.error('Error in findByIdResponse:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  getOrdersForCustomerInvoicing(
    customerId: number,
    dateRange: DateRange,
    pagination: PaginationCriteria,
    options?: {
      asPromise?: boolean;
      isBilled?: boolean;
      includeDeleted?: boolean;
    },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>> {
    const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString())
      .set('createdAtStart', dateRange.startDate ?? '')
      .set('createdAtEnd', dateRange.endDate ?? '')
      .set('isBilled', options?.isBilled?.toString() ?? 'false')
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    if (pagination.sortOrders?.length) {
      params.append(
        'properties',
        pagination.sortOrders?.map((s) => s.property).join(','),
      );
      params.append(
        'directions',
        pagination.sortOrders.map((s) => s.direction).join(','),
      );
    }

    const request = this.httpClient
      .get<
        ApiResponse<DeliveryOrderResponse>
      >(`${this.API_URL}${this.localEndpoint}/orders/invoicing-by-date-range/${customerId}`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching delivery orders:', error);
          return throwError(() => error);
        }),
      );

    return options?.asPromise ? firstValueFrom(request) : request;
  }

  findByIdListAndDominantCustomer(
    ids: number[],
    sortOrders?: Sort[],
    options?: {
      asPromise?: boolean;
      includeDeleted?: boolean;
    },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>> {
    const params = new HttpParams()
      .set('ids', ids?.map((id) => id).join(','))
      .set('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    if (sortOrders?.length) {
      params.append('properties', sortOrders?.map((s) => s.property).join(','));
      params.append('directions', sortOrders.map((s) => s.direction).join(','));
    }

    const request = this.httpClient
      .get<
        ApiResponse<DeliveryOrderResponse>
      >(`${this.API_URL}${this.localEndpoint}/orders/invoicing-by-dominant-user`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching delivery orders:', error);
          return throwError(() => error);
        }),
      );

    return options?.asPromise ? firstValueFrom(request) : request;
  }
}
