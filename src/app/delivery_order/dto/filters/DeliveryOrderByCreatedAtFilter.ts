import { DateRangeFilter } from '../../../generics/dto/DateRangeFilter';
import { PaginationFilter } from '../../../shared/domain/models/pagination/PaginationCriteria';

export interface DeliveryOrderByCreatedAtFilter
  extends PaginationFilter,
    DateRangeFilter {}
