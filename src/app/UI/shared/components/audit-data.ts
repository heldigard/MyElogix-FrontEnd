import type { UserBasic } from '../../../users/domain/models/UserBasic';

export interface AuditData {
  id?: number;
  createdBy?: UserBasic;
  createdAt?: Date;
  productionBy?: UserBasic;
  productionAt?: Date;
  finishedBy?: UserBasic;
  finishedAt?: Date;
  deliveredBy?: UserBasic;
  deliveredAt?: Date;
  cancelledBy?: UserBasic;
  cancelledAt?: Date;
  billedBy?: UserBasic;
  billedAt?: Date;
  updatedBy?: UserBasic;
  updatedAt?: Date;
  pausedBy?: UserBasic;
  pausedAt?: Date;
}
