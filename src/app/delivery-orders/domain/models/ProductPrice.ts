import { UserBasic } from '../../../users/domain/models/UserBasic';

export interface ProductPrice {
  id: number;
  priceListId?: number;
  productRef?: string;
  cmsPrice?: number;
  unitPrice?: number;
  waste?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: UserBasic;
  updatedBy?: UserBasic;
  deletedBy?: UserBasic;
  deleted?: boolean;
}
