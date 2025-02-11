import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { ProductCategory } from './ProductCategory';

export interface ProductType extends GenericNamed {
  description?: string;
  category?: ProductCategory;
  isMeasurable?: boolean;
}
