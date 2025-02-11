import { GenericEntity } from '../../../generics/domain/model/GenericEntity';
import { RoleModel } from './RoleModel';

export interface UserModel extends GenericEntity {
  firstName?: string;
  lastName?: string;
  office?: string;
  department?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  username?: string;
  avatar?: string;
  isActive?: boolean;
  isLocked?: boolean;
  roles?: RoleModel[];
}
