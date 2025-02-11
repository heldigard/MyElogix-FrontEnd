import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { GenericStatus } from '../../../../generics/domain/model/GenericStatus';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { GenericStatusGatewayImpl } from '../../../../generics/insfrastructure/GenericStatusGatewayImpl';
import { Hits } from '../../../../shared/domain/models/Hits';
import { Product } from '../../../domain/models/Product';
import { ProductGateway } from '../../../domain/models/gateways/ProductGateway';

@Injectable({
  providedIn: 'root',
})
export class ProductGatewayImpl
  extends GenericStatusGatewayImpl<GenericStatus>
  implements ProductGateway
{
  constructor() {
    super('/product');
  }

  deleteByReference(reference: string): Observable<boolean> {
    const endpoint = this.localEndpoint + '/delete/reference';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('reference', reference);

    return this.httpClient.delete<boolean>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }

  findByReference(
    reference: string,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Product>> | Promise<ApiResponse<Product>> {
    let queryParams = new HttpParams().set(
      'includeDeleted',
      options?.includeDelete?.toString() ?? 'false',
    );

    const request = this.httpClient
      .put<ApiResponse<Product>>(
        `${this.apiURL}${this.localEndpoint}/reference/${reference}`,
        null,
        {
          params: queryParams,
        },
      )
      .pipe(
        map((response: ApiResponse<Product>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error in findByReference:', error);
          throw error;
        }),
      );

    return options?.asPromise ? lastValueFrom(request) : request;
  }

  updateHits(
    hits: Hits,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number> {
    const endpoint = this.localEndpoint + '/hits';

    return this.httpClient.put<number>(this.apiURL + endpoint, hits);
  }

  incrementHits(
    hits: Hits,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number> {
    const endpoint = this.localEndpoint + '/increment/hits';

    return this.httpClient.put<number>(this.apiURL + endpoint, hits);
  }

  override uploadExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.uploadProductTypeExcelFile(formData).pipe(
      catchError((err) => {
        console.error('Error en la petición:', err);
        return of(null); // Manejar el error de forma adecuada
      }),
      switchMap(() => this.uploadProductCategoryExcelFile(formData)), // Iniciar la siguiente petición
      switchMap(() => this.uploadProductExcelFile(formData)), // Iniciar la última petición
    );
  }

  uploadProductTypeExcelFile(file: FormData): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiURL}/product-type/excel/upload`, file, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        catchError((err) => {
          console.error('Error en la petición:', err);
          return of(null); // Manejar el error de forma adecuada
        }),
      );
  }

  uploadProductCategoryExcelFile(file: FormData): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiURL}/product-category/excel/upload`, file, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        catchError((err) => {
          console.error('Error en la petición:', err);
          return of(null); // Manejar el error de forma adecuada
        }),
      );
  }

  uploadProductExcelFile(file: FormData): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiURL}${this.localEndpoint}/excel/upload`, file, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        catchError((err) => {
          console.error('Error en la petición:', err);
          return of(null); // Manejar el error de forma adecuada
        }),
      );
  }
}
