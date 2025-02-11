import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { ProductType } from '../models/ProductType';
import { ProductTypeGateway } from '../models/gateways/ProductTypeGateway';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeUseCase extends GenericNamedUseCase<
  ProductType,
  ProductTypeGateway
> {
  constructor(protected override gateway: ProductTypeGateway) {
    super(gateway);
  }
}
