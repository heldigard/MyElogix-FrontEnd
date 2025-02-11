import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericUseCase } from '../../../generics/domain/usecase/GenericUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { EMembership } from '../models/EMembership';
import { Membership } from '../models/Membership';
import { MembershipGateway } from '../models/gateways/MembershipGateway';

@Injectable({
  providedIn: 'root',
})
export class MembershipUseCase extends GenericUseCase<
  Membership,
  MembershipGateway
> {
  constructor(protected override gateway: MembershipGateway) {
    super(gateway);
  }

  deleteByName(
    name: string,
    options: { asPromise?: boolean; includeDeleted?: boolean },
  ): Observable<ApiResponse<Membership>> | Promise<ApiResponse<Membership>> {
    return this.gateway.deleteByName(name, options);
  }

  findByName(
    name: EMembership,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Membership>> | Promise<ApiResponse<Membership>> {
    return this.gateway.findByName(name, options);
  }
}
