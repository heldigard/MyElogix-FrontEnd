import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericBasicUseCase } from '../../../generics/domain/usecase/GenericBasicUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { EStatus } from '../models/EStatus';
import { Status } from '../models/Status';
import { StatusGateway } from '../models/gateways/StatusGateway';

@Injectable({
  providedIn: 'root',
})
export class StatusUseCase extends GenericBasicUseCase<Status, StatusGateway> {
  constructor(protected override gateway: StatusGateway) {
    super(gateway);
  }

  findByName(
    name: EStatus,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Status>> | Promise<ApiResponse<Status>> {
    return this.gateway.findByName(name);
  }

  findByNameIn(
    names: EStatus[],
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Status>> | Promise<ApiResponse<Status>> {
    return this.gateway.findByNameIn(names, options);
  }
}
