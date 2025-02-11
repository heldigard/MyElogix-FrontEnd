import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { BranchOffice } from './BranchOffice';
import { DocumentType } from './DocumentType';
import { Membership } from './Membership';

export interface Customer extends GenericNamed {
  documentType?: DocumentType;
  branchOfficeList?: BranchOffice[];
  documentNumber?: string;
  email?: string;
  phone?: string;
  membership?: Membership;
  hits?: number;
  isActive?: boolean;
}
