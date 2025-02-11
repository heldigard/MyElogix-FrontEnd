import { BranchOffice } from '../../../customers/domain/models/BranchOffice';
import { Customer } from '../../../customers/domain/models/Customer';
import { DeliveryZoneBasic } from '../../../customers/domain/models/DeliveryZoneBasic';
import { Status } from '../../../delivery-orders/domain/models/Status';
import { GenericProduction } from '../../../generics/domain/model/GenericProduction';
import { ProductOrder } from '../../../product-order/domain/model/ProductOrder';
import { UserBasic } from '../../../users/domain/models/UserBasic';

export interface DeliveryOrder extends GenericProduction {
  customer?: Customer;
  branchOffice?: BranchOffice;
  deliveryZone?: DeliveryZoneBasic;
  productOrders: ProductOrder[];
  generalObservations?: string;
  totalPrice?: number;
  billedAt?: Date;
  billedBy?: UserBasic;
  status?: Status;
  isBilled?: boolean;
}
