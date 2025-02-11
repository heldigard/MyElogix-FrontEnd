import { DateRangeFilter } from '../../../delivery-orders/infrastructure/entry_points/DTO/delivery_orders/CreatedAtFilter';
import { CustomerIdFilter } from '../../../delivery-orders/infrastructure/entry_points/DTO/delivery_orders/CustomerIdFilter';
import { BilledFilter } from '../../../generics/dto/BilledFilter';
import { PaginationFilter } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { StatusFilter } from '../../../shared/domain/models/StatusFilter';

export interface DeliveryOrderByCreatedAtByCustomerIdByBilledFilter
  extends PaginationFilter,
    DateRangeFilter,
    StatusFilter,
    CustomerIdFilter,
    BilledFilter {}
