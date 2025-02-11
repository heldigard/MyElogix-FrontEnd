import { Injectable } from '@angular/core';
import { GenericService } from '../../../generics/insfrastructure/services/generic.service';
import { UserModel } from '../../domain/models/UserModel';
import { UserModelGateway } from '../../domain/models/gateways/UserModelGateway';
import { UserModelUseCase } from '../../domain/usecase/UserModelUseCase';

@Injectable({
  providedIn: 'root',
})
export class UserModelService extends GenericService<
  UserModel,
  UserModelGateway,
  UserModelUseCase
> {
  constructor(protected override readonly useCase: UserModelUseCase) {
    super(useCase);
  }
}
