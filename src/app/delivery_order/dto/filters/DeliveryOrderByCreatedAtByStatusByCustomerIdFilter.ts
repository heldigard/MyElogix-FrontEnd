import { CustomerIdFilter } from '../../../delivery-orders/infrastructure/entry_points/DTO/delivery_orders/CustomerIdFilter';
import { DateRangeFilter } from '../../../generics/dto/DateRangeFilter';
import { PaginationFilter } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { StatusFilter } from '../../../shared/domain/models/StatusFilter';

export interface DeliveryOrderByCreatedAtByStatusByCustomerIdFilter
  extends PaginationFilter,
    DateRangeFilter,
    StatusFilter,
    CustomerIdFilter {}
