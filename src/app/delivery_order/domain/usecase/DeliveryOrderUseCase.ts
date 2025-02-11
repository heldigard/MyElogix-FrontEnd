import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericProductionUseCase } from '../../../generics/domain/usecase/GenericProductionUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../../shared/domain/models/pagination/Sort';
import type { DeliveryOrderResponse } from '../../dto/DeliveryOrderResponse';
import { DeliveryOrderGateway } from '../gateway/DeliveryOrderGateway';
import { DeliveryOrder } from '../model/DeliveryOrder';

@Injectable({
  providedIn: 'root',
})
export class DeliveryOrderUseCase extends GenericProductionUseCase<
  DeliveryOrder,
  DeliveryOrderGateway
> {
  constructor(protected override readonly gateway: DeliveryOrderGateway) {
    super(gateway);
  }

  nuevo(
    customerId: number,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>> {
    return this.gateway.nuevo(customerId, options);
  }

  updateIsBilled(
    id: number,
    isBilled: boolean,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>> {
    return this.gateway.updateIsBilled(id, isBilled, options);
  }

  updateBatchBillingStatus(
    ids: number[],
    isBilled: boolean,
    options?: { asPromise?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrder>>
    | Promise<ApiResponse<DeliveryOrder>> {
    return this.gateway.updateBatchBillingStatus(ids, isBilled, options);
  }

  findByIdResponse(
    id: number,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>> {
    return this.gateway.findByIdResponse(id, options);
  }

  getOrdersForCustomerInvoicing(
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
    | Promise<ApiResponse<DeliveryOrderResponse>> {
    return this.gateway.getOrdersForCustomerInvoicing(
      customerId,
      dateRange,
      pagination,
      options,
    );
  }

  findByIdListAndDominantCustomer(
    ids: number[],
    sortOrders?: Sort[],
    options?: {
      asPromise?: boolean;
      includeDeleted?: boolean;
    },
  ):
    | Observable<ApiResponse<DeliveryOrderResponse>>
    | Promise<ApiResponse<DeliveryOrderResponse>> {
    return this.gateway.findByIdListAndDominantCustomer(
      ids,
      sortOrders,
      options,
    );
  }
}
