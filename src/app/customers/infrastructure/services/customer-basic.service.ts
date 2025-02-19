import { inject, Injectable } from '@angular/core';
import { GenericNamedBasicService } from '../../../generics/insfrastructure/services/generic-named-basic.service';
import { Sort } from '../../../shared/domain/models/pagination/Sort';
import { CustomerBasic } from '../../domain/models/CustomerBasic';
import { CustomerBasicGateway } from '../../domain/models/gateways/CustomerBasicGateway';
import { CustomerBasicUseCase } from '../../domain/usecase/CustomerBasicUseCase';

@Injectable({
  providedIn: 'root',
})
export class CustomerBasicService extends GenericNamedBasicService<
  CustomerBasic,
  CustomerBasicGateway,
  CustomerBasicUseCase
> {
  constructor() {
    super(inject(CustomerBasicUseCase));
  }

  public findInListByName(name: string): CustomerBasic | undefined {
    return this.items().find(
      (customer: CustomerBasic) => customer.name === name,
    );
  }

  public createSortOrders(): Sort[] {
    return [
      {
        direction: 'DESC',
        property: 'hits',
      },
      {
        direction: 'ASC',
        property: 'createdAt',
      },
      {
        direction: 'ASC',
        property: 'id',
      },
    ];
  }
}
