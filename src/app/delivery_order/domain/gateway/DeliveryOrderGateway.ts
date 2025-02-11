import { Observable } from 'rxjs';
import { GenericProductionGateway } from '../../../generics/domain/gateway/GenericProductionGateway';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../../shared/domain/models/pagination/Sort';
import type { DeliveryOrderResponse } from '../../dto/DeliveryOrderResponse';
import { DeliveryOrder } from '../model/DeliveryOrder';

export abstract class DeliveryOrderGateway extends GenericProductionGateway<DeliveryOrder> {
  abstract nuevo(
    customerId: number,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>>;
  abstract updateIsBilled(
    id: number,
    isBilled: boolean,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>>;
  abstract updateBatchBillingStatus(
    ids: number[],
    isBilled: boolean,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>>;
  abstract findByIdResponse(
    id: number,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>>;
  abstract getOrdersForCustomerInvoicing(
    customerId: number,
    dateRange: DateRange,
    pagination: PaginationCriteria,
    options?: {
      asPromise?: boolean;
      isBilled?: boolean;
      includeDeleted?: boolean;
    },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>>;
  abstract findByIdListAndDominantCustomer(
    ids: number[],
    sortOrders?: Sort[],
    options?: {
      asPromise?: boolean;
      includeDeleted?: boolean;
    },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>>;
}
