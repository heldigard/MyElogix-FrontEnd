import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginationCriteria } from '../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../shared/domain/models/pagination/Sort';
import { GenericBasicGateway } from '../domain/gateway/GenericBasicGateway';
import { GenericBasicEntity } from '../domain/model/GenericBasicEntity';
import { ApiResponse } from '../dto/ApiResponse';
import { PaginationResponse } from '../dto/PaginationResponse';

export abstract class GenericBasicGatewayImpl<T extends GenericBasicEntity>
  implements GenericBasicGateway<T>
{
  protected httpClient: HttpClient = inject(HttpClient);
  protected API_URL = environment.API_URL + environment.apiVersion;
  constructor(protected readonly localEndpoint: string) {}

  findById(
    id: number,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    let queryParams = new HttpParams();

    if (options?.includeDeleted) {
      queryParams = queryParams.append(
        'includeDeleted',
        options.includeDeleted,
      );
    }

    const request = this.httpClient
      .get<ApiResponse<T>>(`${this.API_URL}${this.localEndpoint}/${id}`, {
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
          console.error('Error in findById:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findByIdIn(
    ids: number[],
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    if (!ids?.length) {
      throw new Error('ID list cannot be empty');
    }

    const endpoint = this.localEndpoint + '/batch';
    let queryParams = new HttpParams();

    // Add ids
    ids.forEach((id) => {
      queryParams = queryParams.append('ids', id.toString());
    });

    // Add sort options if present
    if (options?.sortOrders) {
      options.sortOrders.forEach((sort) => {
        queryParams = queryParams.append('properties', sort.property);
        queryParams = queryParams.append('directions', sort.direction);
      });
    }

    // Add includeDeleted parameter
    queryParams = queryParams.append(
      'includeDeleted',
      options?.includeDeleted ?? false,
    );

    const request = this.httpClient
      .get<ApiResponse<T>>(this.API_URL + endpoint, {
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
          console.error('Error in findByIdIn:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findAll(options?: {
    sortOrders?: Sort[];
    includeDeleted?: boolean;
    asPromise?: boolean;
  }): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    const endpoint = this.localEndpoint + '/all';
    let queryParams = new HttpParams();

    // Add sort options if present
    if (options?.sortOrders) {
      options.sortOrders.forEach((sort) => {
        queryParams = queryParams.append('properties', sort.property);
        queryParams = queryParams.append('directions', sort.direction);
      });
    }

    // Add includeDeleted parameter
    queryParams = queryParams.append(
      'includeDeleted',
      options?.includeDeleted ?? false,
    );

    const request = this.httpClient
      .get<ApiResponse<T>>(this.API_URL + endpoint, {
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
          console.error('Error in findAll:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  findAllPagination(
    pagination: PaginationCriteria,
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<PaginationResponse<T>> | Promise<PaginationResponse<T>> {
    const endpoint = this.localEndpoint + '/pagination';
    let queryParams = new HttpParams()
      .append('page', pagination.page?.toString() ?? '0')
      .append('pageSize', pagination.pageSize?.toString() ?? '10')
      .append('includeDeleted', options?.includeDeleted?.toString() ?? 'false');

    // Add sort options if present
    if (options?.sortOrders?.length) {
      options?.sortOrders.forEach((sort) => {
        queryParams = queryParams.append('properties', sort.property);
        queryParams = queryParams.append('directions', sort.direction);
      });
    }

    const request = this.httpClient
      .get<PaginationResponse<T>>(this.API_URL + endpoint, {
        params: queryParams,
      })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in findAllPagination:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }
}
