import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericUseCase } from '../../../generics/domain/usecase/GenericUseCase';
import { ERole } from '../models/ERole';
import { RoleModel } from '../models/RoleModel';
import { RoleModelGateway } from '../models/gateways/RoleModelGateway';
import type { ApiResponse } from '../../../generics/dto/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class RoleModelUseCase extends GenericUseCase<
  RoleModel,
  RoleModelGateway
> {
  constructor(protected override gateway: RoleModelGateway) {
    super(gateway);
  }

  deleteByName(
    name: ERole,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<RoleModel>> | Promise<ApiResponse<RoleModel>> {
    return this.gateway.deleteByName(name);
  }

  findByName(
    name: ERole,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<RoleModel>> | Promise<ApiResponse<RoleModel>> {
    return this.gateway.findByName(name);
  }
}
