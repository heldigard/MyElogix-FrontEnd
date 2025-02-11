import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericUseCase } from '../../../generics/domain/usecase/GenericUseCase';
import { ERole } from '../models/ERole';
import { RoleModel } from '../models/RoleModel';
import { RoleModelGateway } from '../models/gateways/RoleModelGateway';

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

  deleteByName(name: ERole): Observable<boolean> {
    return this.gateway.deleteByName(name);
  }

  findByName(name: ERole): Observable<RoleModel> {
    return this.gateway.findByName(name);
  }
}
