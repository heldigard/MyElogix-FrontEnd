import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { BranchOffice } from './BranchOffice';

export interface ContactPerson extends GenericNamed {
  mobileNumberPrimary?: string;
  mobileNumberSecondary?: string;
  branchOfficeList?: BranchOffice[];
}
