import { Injectable } from '@angular/core';
import { GenericService } from '../../../generics/insfrastructure/services/generic.service';
import { RoleModelGateway } from '../../domain/models/gateways/RoleModelGateway';
import { RoleModel } from '../../domain/models/RoleModel';
import { RoleModelUseCase } from '../../domain/usecase/RoleModelUseCase';

@Injectable({
  providedIn: 'root',
})
export class RoleModelService extends GenericService<
  RoleModel,
  RoleModelGateway,
  RoleModelUseCase
> {
  constructor(protected override readonly useCase: RoleModelUseCase) {
    super(useCase);
  }
}
