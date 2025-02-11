import { GenericNamedBasic } from '../../../generics/domain/model/GenericNamedBasic';

export interface ContactPersonBasic extends GenericNamedBasic {
  mobileNumberPrimary?: string;
  mobileNumberSecondary?: string;
}
