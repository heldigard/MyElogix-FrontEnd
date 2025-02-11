import { Injectable } from '@angular/core';
import { GenericProductionGatewayImpl } from '../../generics/insfrastructure/GenericProductionGatewayImpl';
import { ProductOrderGateway } from '../domain/gateway/ProductOrderGateway';
import { ProductOrder } from '../domain/model/ProductOrder';

@Injectable({
  providedIn: 'root',
})
export class ProductOrderGatewayImpl
  extends GenericProductionGatewayImpl<ProductOrder>
  implements ProductOrderGateway
{
  constructor() {
    super('/product-order');
  }
}
