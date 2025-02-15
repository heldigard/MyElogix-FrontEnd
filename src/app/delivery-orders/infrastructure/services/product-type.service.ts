import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import type { ProductType } from '../../domain/models/ProductType';
import type { ProductTypeGateway } from '../../domain/models/gateways/ProductTypeGateway';
import { ProductTypeUseCase } from '../../domain/usecase/ProductTypeUseCase';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService extends GenericNamedService<
  ProductType,
  ProductTypeGateway,
  ProductTypeUseCase
> {
  constructor() {
    super(inject(ProductTypeUseCase));
  }
}
