import { GenericBasicEntity } from '../../../generics/domain/model/GenericBasicEntity';

export interface BranchOfficeBasic extends GenericBasicEntity {
  customerId?: number;
  address?: string;
}
