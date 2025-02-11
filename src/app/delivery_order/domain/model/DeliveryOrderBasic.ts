import { CustomerBasic } from '../../../customers/domain/models/CustomerBasic';
import { DeliveryZoneBasic } from '../../../customers/domain/models/DeliveryZoneBasic';
import { GenericProduction } from '../../../generics/domain/model/GenericProduction';
import { UserBasic } from '../../../users/domain/models/UserBasic';

export interface DeliveryOrderBasic extends GenericProduction {
  customer?: CustomerBasic;
  deliveryZone?: DeliveryZoneBasic;
  billedAt?: Date;
  billedBy?: UserBasic;
  isBilled?: boolean;
}
