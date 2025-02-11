import { UserBasic } from '../../../users/domain/models/UserBasic';
import { GenericBasicEntity } from './GenericBasicEntity';

export interface GenericEntity extends GenericBasicEntity {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: UserBasic;
  updatedBy?: UserBasic;
  deletedBy?: UserBasic;
}
