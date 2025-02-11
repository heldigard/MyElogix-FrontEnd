import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericStatusUseCase } from '../../../generics/domain/usecase/GenericStatusUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { Hits } from '../../../shared/domain/models/Hits';
import { Product } from '../models/Product';
import { ProductGateway } from '../models/gateways/ProductGateway';

@Injectable({
  providedIn: 'root',
})
export class ProductUseCase extends GenericStatusUseCase<
  Product,
  ProductGateway
> {
  constructor(protected override gateway: ProductGateway) {
    super(gateway);
  }

  findByReference(
    reference: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Product>> | Promise<ApiResponse<Product>> {
    return this.gateway.findByReference(reference, options);
  }

  updateHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number> {
    return this.gateway.updateHits(hits, options);
  }

  incrementHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number> {
    return this.gateway.incrementHits(hits, options);
  }
}
