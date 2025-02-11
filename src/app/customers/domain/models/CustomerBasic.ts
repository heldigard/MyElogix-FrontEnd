import { GenericNamedBasic } from '../../../generics/domain/model/GenericNamedBasic';
import { Membership } from './Membership';

export interface CustomerBasic extends GenericNamedBasic {
  documentNumber?: string;
  email?: string;
  phone?: string;
  membership?: Membership;
  hits?: number;
  isActive?: boolean;
}
