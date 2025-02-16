import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { GenericBasicGatewayImpl } from '../../../generics/insfrastructure/GenericBasicGatewayImpl';
import { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { DeliveryOrderBasicGateway } from '../../domain/gateway/DeliveryOrderBasicGateway';
import { DeliveryOrderBasic } from '../../domain/model/DeliveryOrderBasic';
import { CustomerOrdersSummaryDTO } from '../../dto/CustomerOrdersSummaryDTO';
import type { PaginationResponse } from '../../../generics/dto/PaginationResponse';

@Injectable({
  providedIn: 'root',
})
export class DeliveryOrderBasicGatewayImpl
  extends GenericBasicGatewayImpl<DeliveryOrderBasic>
  implements DeliveryOrderBasicGateway
{
  constructor() {
    super('/delivery-order-basic');
  }

  getOrdersForInvoicing(
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderBasic>>
    | Promise<ApiResponse<DeliveryOrderBasic>> {
    let params = new HttpParams()
      .set('page', pagination?.page.toString() ?? '0')
      .set('pageSize', pagination?.pageSize.toString() ?? '100')
      .set('includeDeleted', (options?.includeDeleted ?? false).toString());

    if (pagination?.sortOrders && pagination.sortOrders.length > 0) {
      pagination.sortOrders.forEach((sort) => {
        params = params
          .append('properties', sort.property)
          .append('directions', sort.direction);
      });
    }

    if (dateRange) {
      params = params
        .set('startDate', dateRange.startDate ?? '')
        .set('endDate', dateRange.endDate ?? '');
    }

    const request = this.httpClient
      .get<
        ApiResponse<DeliveryOrderBasic>
      >(`${this.API_URL}${this.localEndpoint}/orders/invoicing-by-date-range`, { params })
      .pipe(
        map((response: ApiResponse<DeliveryOrderBasic>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in getOrdersForInvoicing:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  getByStatusFiltered(
    statusIdList: number[],
    pagination: PaginationCriteria,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<PaginationResponse<DeliveryOrderBasic>>
    | Promise<PaginationResponse<DeliveryOrderBasic>> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString())
      .set('includeDeleted', (options?.includeDeleted ?? false).toString());

    // Add sorting parameters from PaginationCriteria.sortOrders
    if (pagination.sortOrders && pagination.sortOrders.length > 0) {
      pagination.sortOrders.forEach((sort) => {
        params = params
          .append('properties', sort.property)
          .append('directions', sort.direction);
      });
    }

    const request = this.httpClient
      .post<
        PaginationResponse<DeliveryOrderBasic>
      >(`${this.API_URL}${this.localEndpoint}/filter-by-status`, statusIdList, { params })
      .pipe(
        map((response: PaginationResponse<DeliveryOrderBasic>) => {
          if (!response.success || !response.rows) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in getByStatusFiltered:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  getByStatusAndDateRange(
    statusIdList: number[],
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderBasic>>
    | Promise<ApiResponse<DeliveryOrderBasic>> {
    let params = new HttpParams()
      .set('page', pagination?.page.toString() ?? '0')
      .set('pageSize', pagination?.pageSize.toString() ?? '100')
      .set('includeDeleted', (options?.includeDeleted ?? false).toString());

    // Add sorting parameters from PaginationCriteria.sortOrders
    if (pagination?.sortOrders && pagination.sortOrders?.length > 0) {
      pagination.sortOrders.forEach((sort) => {
        params = params
          .append('properties', sort.property)
          .append('directions', sort.direction);
      });
    }

    params = params
      .set('startDate', dateRange?.startDate ?? '')
      .set('endDate', dateRange?.endDate ?? '');

    const request = this.httpClient
      .get<ApiResponse<DeliveryOrderBasic>>(
        `${this.API_URL}${this.localEndpoint}/filter-by-status-and-date`,
        {
          params: {
            ...params,
            statusIds: statusIdList,
          },
        },
      )
      .pipe(
        map((response: ApiResponse<DeliveryOrderBasic>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in getByStatusFiltered:', error);
          throw error;
        }),
      );
    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findCustomerOrdersSummary(
    isBilled: boolean = false,
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<CustomerOrdersSummaryDTO>>
    | Promise<ApiResponse<CustomerOrdersSummaryDTO>> {
    let params = new HttpParams()
      .set('isBilled', isBilled.toString())
      .set('page', pagination?.page.toString() ?? '0')
      .set('pageSize', pagination?.pageSize.toString() ?? '100')
      .set('includeDeleted', (options?.includeDeleted ?? false).toString());

    // Add sorting parameters from PaginationCriteria.sortOrders
    if (pagination?.sortOrders && pagination.sortOrders?.length > 0) {
      pagination.sortOrders.forEach((sort) => {
        params = params
          .append('properties', sort.property)
          .append('directions', sort.direction);
      });
    }

    params = params
      .set('startDate', dateRange?.startDate ?? '')
      .set('endDate', dateRange?.endDate ?? '');

    const request = this.httpClient
      .get<
        ApiResponse<CustomerOrdersSummaryDTO>
      >(`${this.API_URL}${this.localEndpoint}/orders/billed/summary`, { params })
      .pipe(
        map((response: ApiResponse<CustomerOrdersSummaryDTO>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in findCustomerOrdersSummary:', error);
          throw error;
        }),
      );
    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
