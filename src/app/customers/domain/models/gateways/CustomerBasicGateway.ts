import { Observable } from 'rxjs';
import { GenericNamedBasicGateway } from '../../../../generics/domain/gateway/GenericNamedBasicGateway';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { CustomerBasic } from '../CustomerBasic';

export abstract class CustomerBasicGateway extends GenericNamedBasicGateway<CustomerBasic> {
  abstract findByEmail(
    email: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ):
    | Observable<ApiResponse<CustomerBasic>>
    | Promise<ApiResponse<CustomerBasic>>;
  abstract findByDocumentNumber(
    documentNumber: string,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ):
    | Observable<ApiResponse<CustomerBasic>>
    | Promise<ApiResponse<CustomerBasic>>;
}
