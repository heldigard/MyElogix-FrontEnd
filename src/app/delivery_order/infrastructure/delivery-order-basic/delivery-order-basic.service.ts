import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EStatus } from '../../../delivery-orders/domain/models/EStatus';
import { GenericBasicService } from '../../../generics/insfrastructure/services/generic-basic.service';
import { StatusService } from '../../../shared/infrastructure/status.service';
import { DeliveryOrderBasic } from '../../domain/model/DeliveryOrderBasic';
import { DeliveryOrderBasicUseCase } from '../../domain/usecase/DeliveryOrderBasicUseCase';
import type { ApiResponse } from '../../../generics/dto/ApiResponse';
import type { DateRange } from '../../../shared/domain/models/pagination/DateRange';
import type { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import type { Sort } from '../../../shared/domain/models/pagination/Sort';
import type { DeliveryOrderBasicGateway } from '../../domain/gateway/DeliveryOrderBasicGateway';
import type { CustomerOrdersSummaryDTO } from '../../dto/CustomerOrdersSummaryDTO';
import type { PaginationResponse } from '../../../generics/dto/PaginationResponse';

@Injectable({
  providedIn: 'root',
})
export class DeliveryOrderBasicService extends GenericBasicService<
  DeliveryOrderBasic,
  DeliveryOrderBasicGateway,
  DeliveryOrderBasicUseCase
> {
  private readonly statusService: StatusService = inject(StatusService);
  private readonly DEFAULT_PAGE_SIZE = 100;

  public reloadOrders: Subject<boolean> = new Subject<boolean>();

  constructor(protected override useCase: DeliveryOrderBasicUseCase) {
    super(useCase);
  }

  async getOrdersForInvoicing(
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { includeDeleted?: boolean },
  ): Promise<DeliveryOrderBasic[]> {
    try {
      const response = (await this.useCase.getOrdersForInvoicing(
        pagination,
        dateRange,
        { asPromise: true, ...options },
      )) as ApiResponse<DeliveryOrderBasic>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in getOrdersForInvoicing:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  async findCustomerOrdersSummary(
    isBilled: boolean,
    pagination?: PaginationCriteria,
    dateRange?: DateRange,
    options?: { includeDeleted?: boolean },
  ): Promise<CustomerOrdersSummaryDTO[]> {
    try {
      const response = (await this.useCase.findCustomerOrdersSummary(
        isBilled,
        pagination,
        dateRange,
        { asPromise: true, ...options },
      )) as ApiResponse<CustomerOrdersSummaryDTO>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in findCustomerOrdersSummary:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  public async getByStatus(
    statusToShow?: EStatus,
    pageSize?: number,
    page?: number,
  ): Promise<PaginationResponse<DeliveryOrderBasic>> {
    const pagination = this.getPagination(statusToShow, page, pageSize);

    try {
      if (statusToShow) {
        let response: PaginationResponse<DeliveryOrderBasic>;

        const status = this.statusService.getStatusByName(statusToShow);
        if (!status) {
          throw new Error(`Status not found for ${statusToShow}`);
        }

        response = (await this.useCase.getByStatusFiltered(
          [status.id!],
          pagination,
          { asPromise: true },
        )) as PaginationResponse<DeliveryOrderBasic>;

        if (!response.success || !response.rows) {
          throw new Error('No data received from server');
        }

        return response;
      } else {
        return await this.updateDataList(pagination);
      }
    } catch (error) {
      console.error('Error getting orders:', error);
      return {
        rows: [],
        rowCount: 0,
        pagesCount: 0,
        currentPage: 0,
        success: false,
        message: '',
      };
    }
  }

  public getPagination(
    statusToShow?: EStatus,
    page?: number,
    pageSize?: number,
  ): PaginationCriteria {
    const direction = statusToShow === EStatus.FINISHED ? 'ASC' : 'DESC';
    const sortOrders: Sort[] = [
      { direction, property: 'createdAt' },
      { direction, property: 'id' },
    ];

    return {
      page: page ?? 0,
      pageSize: pageSize ?? this.DEFAULT_PAGE_SIZE,
      sortOrders,
    };
  }
}
