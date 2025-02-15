import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import type { ProductCategory } from '../../domain/models/ProductCategory';
import type { ProductCategoryGateway } from '../../domain/models/gateways/ProductCategoryGateway';
import { ProductCategoryUseCase } from '../../domain/usecase/ProductCategoryUseCase';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService extends GenericNamedService<
  ProductCategory,
  ProductCategoryGateway,
  ProductCategoryUseCase
> {
  constructor() {
    super(inject(ProductCategoryUseCase));
  }
}
