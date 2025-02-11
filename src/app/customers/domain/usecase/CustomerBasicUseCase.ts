import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericNamedBasicUseCase } from '../../../generics/domain/usecase/GenericNamedBasicUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { CustomerBasic } from '../models/CustomerBasic';
import { CustomerBasicGateway } from '../models/gateways/CustomerBasicGateway';

@Injectable({
  providedIn: 'root',
})
export class CustomerBasicUseCase extends GenericNamedBasicUseCase<
  CustomerBasic,
  CustomerBasicGateway
> {
  constructor(protected override gateway: CustomerBasicGateway) {
    super(gateway);
  }

  findByEmail(
    email: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ):
    | Observable<ApiResponse<CustomerBasic>>
    | Promise<ApiResponse<CustomerBasic>> {
    return this.gateway.findByEmail(email, options);
  }

  findByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ):
    | Observable<ApiResponse<CustomerBasic>>
    | Promise<ApiResponse<CustomerBasic>> {
    return this.gateway.findByDocumentNumber(documentNumber, options);
  }
}
