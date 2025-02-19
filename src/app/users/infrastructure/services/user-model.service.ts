import { Injectable } from '@angular/core';
import { GenericService } from '../../../generics/insfrastructure/services/generic.service';
import { UserModel } from '../../domain/models/UserModel';
import { UserModelGateway } from '../../domain/models/gateways/UserModelGateway';
import { UserModelUseCase } from '../../domain/usecase/UserModelUseCase';
import type { Sort } from '../../../shared/domain/models/pagination/Sort';

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

  public createSortOrders(): Sort[] {
    return [
      {
        direction: 'ASC',
        property: 'username',
      },
    ];
  }
}
