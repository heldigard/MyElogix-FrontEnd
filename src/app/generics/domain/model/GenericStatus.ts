import { Status } from '../../../delivery-orders/domain/models/Status';
import { GenericEntity } from './GenericEntity';

export interface GenericStatus extends GenericEntity {
  status?: Status;
}
