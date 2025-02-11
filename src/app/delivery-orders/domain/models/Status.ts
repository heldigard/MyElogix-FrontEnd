import { GenericBasicEntity } from '../../../generics/domain/model/GenericBasicEntity';
import { EStatus } from './EStatus';

export interface Status extends GenericBasicEntity {
  name?: EStatus;
  description?: string;
}
