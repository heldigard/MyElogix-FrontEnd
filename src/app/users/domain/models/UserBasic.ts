import type { GenericBasicEntity } from '../../../generics/domain/model/GenericBasicEntity';

export interface UserBasic extends GenericBasicEntity {
  firstName?: string;
  lastName?: string;
  username?: string;
  isActive?: boolean;
  isLocked?: boolean;
}
