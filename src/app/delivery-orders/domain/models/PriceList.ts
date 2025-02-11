import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { ProductPrice } from './ProductPrice';

export interface PriceList extends GenericNamed {
  description?: string;
  year?: string;
  month?: string;
  productPriceList?: ProductPrice[];
  isActive?: boolean;
}
