import { Observable } from 'rxjs';
import { GenericGateway } from '../../../../generics/domain/gateway/GenericGateway';
import { ERole } from '../ERole';
import { RoleModel } from '../RoleModel';
import type { ApiResponse } from '../../../../generics/dto/ApiResponse';

export abstract class RoleModelGateway extends GenericGateway<RoleModel> {
  abstract deleteByName(
    name: ERole,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<RoleModel>> | Promise<ApiResponse<RoleModel>>;
  abstract findByName(
    name: ERole,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<RoleModel>> | Promise<ApiResponse<RoleModel>>;
}
