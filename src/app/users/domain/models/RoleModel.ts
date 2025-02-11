import { GenericEntity } from '../../../generics/domain/model/GenericEntity';
import { ERole } from './ERole';

export interface RoleModel extends GenericEntity {
  name?: ERole;
  description?: string;
  isActive?: boolean;
}
