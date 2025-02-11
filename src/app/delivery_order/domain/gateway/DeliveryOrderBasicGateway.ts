import { Observable } from 'rxjs';
import { GenericBasicGateway } from '../../../generics/domain/gateway/GenericBasicGateway';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { CustomerOrdersSummaryDTO } from '../../dto/CustomerOrdersSummaryDTO';
import { DeliveryOrderBasic } from '../model/DeliveryOrderBasic';
import type { PaginationResponse } from '../../../generics/dto/PaginationResponse';

export abstract class DeliveryOrderBasicGateway extends GenericBasicGateway<DeliveryOrderBasic> {
  abstract getOrdersForInvoicing(
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderBasic>>
    | Promise<ApiResponse<DeliveryOrderBasic>>;
  abstract getByStatusFiltered(
    statusIdList: number[],
    pagination: PaginationCriteria,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<PaginationResponse<DeliveryOrderBasic>>
    | Promise<PaginationResponse<DeliveryOrderBasic>>;
  abstract getByStatusAndDateRange(
    statusIdList: number[],
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: {
      asPromise?: boolean;
      isBilled: boolean;
      includeDeleted?: boolean;
    },
  ):
    | Observable<ApiResponse<DeliveryOrderBasic>>
    | Promise<ApiResponse<DeliveryOrderBasic>>;
  abstract findCustomerOrdersSummary(
    isBilled: boolean,
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<CustomerOrdersSummaryDTO>>
    | Promise<ApiResponse<CustomerOrdersSummaryDTO>>;
}
