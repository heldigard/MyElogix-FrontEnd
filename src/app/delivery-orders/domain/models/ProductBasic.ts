import { GenericBasicEntity } from '../../../generics/domain/model/GenericBasicEntity';
import { ProductType } from './ProductType';
import { Status } from './Status';

export interface ProductBasic extends GenericBasicEntity {
  reference?: string;
  description?: string;
  type?: ProductType;
  status?: Status;
  hits?: number;
  isActive?: boolean;
  isLowStock?: boolean;
}
