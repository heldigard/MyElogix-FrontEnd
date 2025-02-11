import { GenericProductionGateway } from '../../../generics/domain/gateway/GenericProductionGateway';
import { ProductOrder } from '../model/ProductOrder';

export abstract class ProductOrderGateway extends GenericProductionGateway<ProductOrder> {}
