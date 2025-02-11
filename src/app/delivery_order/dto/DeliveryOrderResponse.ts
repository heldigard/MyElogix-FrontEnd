import { DeliveryOrder } from '../domain/model/DeliveryOrder';
import type { DeliveryOrderStats } from './DeliveryOrderStats';

export interface DeliveryOrderResponse extends DeliveryOrderStats {
  order: DeliveryOrder;
}
