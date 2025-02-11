import { Observable } from 'rxjs';
import { GenericStatusGateway } from '../../../../generics/domain/gateway/GenericStatusGateway';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { Hits } from '../../../../shared/domain/models/Hits';
import { Product } from '../Product';

export abstract class ProductGateway extends GenericStatusGateway<Product> {
  abstract findByReference(
    reference: string,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Product>> | Promise<ApiResponse<Product>>;
  abstract updateHits(
    hits: Hits,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number>;
  abstract incrementHits(
    hits: Hits,
    options?: { includeDelete?: boolean; asPromise?: boolean },
  ): Observable<number> | Promise<number>;
}
