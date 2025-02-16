import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { RoleModelGateway } from '../../../domain/models/gateways/RoleModelGateway';
import { RoleModel } from '../../../domain/models/RoleModel';
import type { ERole } from '../../../domain/models/ERole';
import type { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { GenericGatewayImpl } from '../../../../generics/insfrastructure/GenericGatewayImpl';

@Injectable({
  providedIn: 'root',
})
export class RoleModelGatewayImpl
  extends GenericGatewayImpl<RoleModel>
  implements RoleModelGateway
{
  constructor() {
    super('/role');
  }

  deleteByName(
    name: ERole,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<RoleModel>> | Promise<ApiResponse<RoleModel>> {
    let queryParams = new HttpParams().set(
      'includeDeleted',
      options?.includeDeleted ?? false,
    );

    const request = this.httpClient
      .delete<ApiResponse<RoleModel>>(
        `${this.API_URL}${this.localEndpoint}/name/${name}`,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<RoleModel>) => {
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

  findByName(
    name: ERole,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<RoleModel>> | Promise<ApiResponse<RoleModel>> {
    let queryParams = new HttpParams()
      .set('name', name)
      .set('includeDeleted', options?.includeDeleted ?? false);

    const request = this.httpClient
      .get<ApiResponse<RoleModel>>(
        `${this.API_URL}${this.localEndpoint}/search/name`,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<RoleModel>) => {
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
}
