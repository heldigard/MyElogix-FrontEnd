import { Observable } from 'rxjs';
import { GenericBasicGateway } from '../../../../generics/domain/gateway/GenericBasicGateway';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { EStatus } from '../EStatus';
import { Status } from '../Status';

export abstract class StatusGateway extends GenericBasicGateway<Status> {
  abstract findByName(
    name: EStatus,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Status>> | Promise<ApiResponse<Status>>;
  abstract findByNameIn(
    names: EStatus[],
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Status>> | Promise<ApiResponse<Status>>;
}
