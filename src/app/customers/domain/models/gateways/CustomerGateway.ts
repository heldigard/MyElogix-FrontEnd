import { Observable } from 'rxjs';
import { GenericNamedGateway } from '../../../../generics/domain/gateway/GenericNamedGateway';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { Hits } from '../../../../shared/domain/models/Hits';
import { Customer } from '../Customer';

export abstract class CustomerGateway extends GenericNamedGateway<Customer> {
  abstract deleteByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>>;
  abstract findByEmail(
    email: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>>;
  abstract findByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>>;
  abstract updateHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>>;
  abstract incrementHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>>;
}
