import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { Hits } from '../../../shared/domain/models/Hits';
import { Customer } from '../models/Customer';
import { CustomerGateway } from '../models/gateways/CustomerGateway';

@Injectable({
  providedIn: 'root',
})
export class CustomerUseCase extends GenericNamedUseCase<
  Customer,
  CustomerGateway
> {
  constructor(protected override gateway: CustomerGateway) {
    super(gateway);
  }

  deleteByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    return this.gateway.deleteByDocumentNumber(documentNumber, options);
  }

  findByEmail(
    email: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    return this.gateway.findByEmail(email, options);
  }

  findByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    return this.gateway.findByDocumentNumber(documentNumber, options);
  }

  updateHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    return this.gateway.updateHits(hits, options);
  }

  incrementHits(
    hits: Hits,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Customer>> | Promise<ApiResponse<Customer>> {
    return this.gateway.incrementHits(hits, options);
  }
}
