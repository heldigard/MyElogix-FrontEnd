import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericBasicUseCase } from '../../../generics/domain/usecase/GenericBasicUseCase';
import { ApiResponse } from '../../../generics/dto/ApiResponse';
import { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { CustomerOrdersSummaryDTO } from '../../dto/CustomerOrdersSummaryDTO';
import { DeliveryOrderBasicGateway } from '../gateway/DeliveryOrderBasicGateway';
import { DeliveryOrderBasic } from '../model/DeliveryOrderBasic';
import type { PaginationResponse } from '../../../generics/dto/PaginationResponse';

@Injectable({
  providedIn: 'root',
})
export class DeliveryOrderBasicUseCase extends GenericBasicUseCase<
  DeliveryOrderBasic,
  DeliveryOrderBasicGateway
> {
  constructor(protected override gateway: DeliveryOrderBasicGateway) {
    super(gateway);
  }

  getOrdersForInvoicing(
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<DeliveryOrderBasic>>
    | Promise<ApiResponse<DeliveryOrderBasic>> {
    return this.gateway.getOrdersForInvoicing(pagination, dateRange, options);
  }

  getByStatusFiltered(
    statusIdList: number[],
    pagination: PaginationCriteria,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<PaginationResponse<DeliveryOrderBasic>>
    | Promise<PaginationResponse<DeliveryOrderBasic>> {
    return this.gateway.getByStatusFiltered(statusIdList, pagination, options);
  }
  getByStatusAndDateRange(
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
    | Promise<ApiResponse<DeliveryOrderBasic>> {
    return this.gateway.getByStatusAndDateRange(
      statusIdList,
      pagination,
      dateRange,
      options,
    );
  }
  findCustomerOrdersSummary(
    isBilled: boolean,
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { asPromise?: boolean; includeDeleted?: boolean },
  ):
    | Observable<ApiResponse<CustomerOrdersSummaryDTO>>
    | Promise<ApiResponse<CustomerOrdersSummaryDTO>> {
    return this.gateway.findCustomerOrdersSummary(
      isBilled,
      pagination,
      dateRange,
      options,
    );
  }
}
