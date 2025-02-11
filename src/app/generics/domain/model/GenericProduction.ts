import { Status } from '../../../delivery-orders/domain/models/Status';
import { UserBasic } from '../../../users/domain/models/UserBasic';
import { GenericEntity } from './GenericEntity';

export interface GenericProduction extends GenericEntity {
  productionAt?: Date;
  finishedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  pausedAt?: Date;
  productionBy?: UserBasic;
  finishedBy?: UserBasic;
  deliveredBy?: UserBasic;
  cancelledBy?: UserBasic;
  pausedBy?: UserBasic;
  isPending?: boolean;
  isProduction?: boolean;
  isFinished?: boolean;
  isDelivered?: boolean;
  isCancelled?: boolean;
  isPaused?: boolean;
  status?: Status;
}
