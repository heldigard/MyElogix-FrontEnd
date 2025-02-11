import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { ProductCategory } from '../../../domain/models/ProductCategory';
import { ProductCategoryGateway } from '../../../domain/models/gateways/ProductCategoryGateway';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryGatewayImpl
  extends GenericNamedGatewayImpl<ProductCategory>
  implements ProductCategoryGateway
{
  constructor() {
    super('/product-category');
  }
}
