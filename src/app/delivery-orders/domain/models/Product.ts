import { GenericEntity } from '../../../generics/domain/model/GenericEntity';
import { ProductPrice } from './ProductPrice';
import { ProductType } from './ProductType';
import { Status } from './Status';

export interface Product extends GenericEntity {
  reference?: string;
  description?: string;
  type?: ProductType;
  price?: ProductPrice;
  status?: Status;
  hits?: number;
  isActive?: boolean;
  isLowStock?: boolean;
}
