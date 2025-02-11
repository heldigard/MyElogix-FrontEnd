import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { ProductCategoryGateway } from '../models/gateways/ProductCategoryGateway';
import { ProductCategory } from '../models/ProductCategory';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryUseCase extends GenericNamedUseCase<
  ProductCategory,
  ProductCategoryGateway
> {
  constructor(protected override gateway: ProductCategoryGateway) {
    super(gateway);
  }
}
