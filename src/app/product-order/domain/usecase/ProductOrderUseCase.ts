import { Injectable } from '@angular/core';
import { GenericProductionUseCase } from '../../../generics/domain/usecase/GenericProductionUseCase';
import { ProductOrderGateway } from '../gateway/ProductOrderGateway';
import { ProductOrder } from '../model/ProductOrder';

@Injectable({
  providedIn: 'root',
})
export class ProductOrderUseCase extends GenericProductionUseCase<
  ProductOrder,
  ProductOrderGateway
> {
  constructor(protected override readonly gateway: ProductOrderGateway) {
    super(gateway);
  }
}
