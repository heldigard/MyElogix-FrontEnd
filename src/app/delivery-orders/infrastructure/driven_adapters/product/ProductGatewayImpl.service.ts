import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import type { GenericStatus } from '../../../../generics/domain/model/GenericStatus';
import type { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { GenericStatusGatewayImpl } from '../../../../generics/insfrastructure/GenericStatusGatewayImpl';
import type { Hits } from '../../../../shared/domain/models/Hits';
import type { Product } from '../../../domain/models/Product';
import type { ProductGateway } from '../../../domain/models/gateways/ProductGateway';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductCategoryService } from '../../services/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductGatewayImpl
  extends GenericStatusGatewayImpl<GenericStatus>
  implements ProductGateway
{
  private readonly typeService = inject(ProductTypeService);
  private readonly categoryService = inject(ProductCategoryService);
  constructor() {
    super('/product');
  }

  deleteByReference(reference: string): Observable<boolean> {
    const endpoint = this.localEndpoint + '/delete/reference';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('reference', reference);

    return this.httpClient.delete<boolean>(this.API_URL + endpoint, {
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
        `${this.API_URL}${this.localEndpoint}/reference/${reference}`,
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

    return this.httpClient.put<number>(this.API_URL + endpoint, hits);
  }

  incrementHits(
    hits: Hits,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number> {
    const endpoint = this.localEndpoint + '/increment/hits';

    return this.httpClient.put<number>(this.API_URL + endpoint, hits);
  }

  override uploadExcelFile(formData: FormData): Promise<any> {
    return lastValueFrom(
      // Start with the type service upload
      from(this.typeService.uploadExcelFile(formData)).pipe(
        // Handle type service errors but continue the chain
        catchError((err) => {
          console.error('Error uploading product types:', err);
          return of(null);
        }),
        // Then upload to category service
        switchMap(() => this.categoryService.uploadExcelFile(formData)),
        catchError((err) => {
          console.error('Error uploading product categories:', err);
          return of(null);
        }),
        // Finally upload to product service
        switchMap(() => this.uploadProductExcelFile(formData)),
        catchError((err) => {
          console.error('Error uploading products:', err);
          throw err; // Rethrow the last error since it's the final step
        }),
      ),
    );
  }

  uploadProductExcelFile(formData: FormData): Observable<any> | Promise<any> {
    return super.uploadExcelFile(formData, { asPromise: true }) as Promise<any>;
  }
}
