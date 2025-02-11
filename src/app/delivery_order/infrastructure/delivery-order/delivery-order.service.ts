import {
  computed,
  inject,
  Injectable,
  signal,
  type Signal,
} from '@angular/core';
import { GenericProductionService } from '../../../generics/insfrastructure/services/generic-production.service';
import { ProductService } from '../../../delivery-orders/infrastructure/services/product.service';
import { StatusService } from '../../../shared/infrastructure/status.service';
import { DeliveryOrderUseCase } from '../../domain/usecase/DeliveryOrderUseCase';
import { ActivatedRoute, Router } from '@angular/router';
import { type BranchOffice } from '../../../customers/domain/models/BranchOffice';
import { type EStatus } from '../../../delivery-orders/domain/models/EStatus';
import { type Status } from '../../../delivery-orders/domain/models/Status';
import { type ApiResponse } from '../../../generics/dto/ApiResponse';
import { type DateRange } from '../../../shared/domain/models/pagination/DateRange';
import { type PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { type Sort } from '../../../shared/domain/models/pagination/Sort';
import { type DeliveryOrderGateway } from '../../domain/gateway/DeliveryOrderGateway';
import { type DeliveryOrder } from '../../domain/model/DeliveryOrder';
import { type DeliveryOrderBasic } from '../../domain/model/DeliveryOrderBasic';
import { type DeliveryOrderResponse } from '../../dto/DeliveryOrderResponse';
import { type DeliveryOrderResponseState } from '../state/delivery-order-state';
import { type DeliveryOrderStats } from '../../dto/DeliveryOrderStats';
import { type DeliveryZoneBasic } from '../../../customers/domain/models/DeliveryZoneBasic';
import {
  SCREEN_TYPE_EDIT,
  SCREEN_TYPE_VIEW_DISPATCH,
  SCREEN_TYPE_VIEW_PRODUCTION,
  URL_COMMERCIAL,
  URL_COMMERCIAL_CREATE,
  URL_COMMERCIAL_EDIT,
  URL_DISPATCH,
  URL_DISPATCH_VIEW,
  URL_ORDERS,
  URL_PRODUCTION,
  URL_PRODUCTION_VIEW,
} from '../../../globals';

@Injectable({
  providedIn: 'root',
})
export class DeliveryOrderService extends GenericProductionService<
  DeliveryOrder,
  DeliveryOrderGateway,
  DeliveryOrderUseCase
> {
  private readonly initialResponseState: DeliveryOrderResponseState = {
    items: [],
    currentItem: undefined,
    rowCount: 0,
    currentPage: 0,
    pagesCount: 0,
    order: this.getBlank(),
    pendingCount: 0,
    productionCount: 0,
    finishedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    pausedCount: 0,
    isLoading: false,
    error: undefined,
    isFormValid: true,
    isObservationsValid: true,
  };
  private readonly stateResponse = signal<DeliveryOrderResponseState>(
    this.initialResponseState,
  );
  private readonly orderStats = computed(() => {
    const state = this.stateResponse();
    return state
      ? {
          pendingCount: state.pendingCount,
          productionCount: state.productionCount,
          finishedCount: state.finishedCount,
          deliveredCount: state.deliveredCount,
          cancelledCount: state.cancelledCount,
          pausedCount: state.pausedCount,
        }
      : null;
  });
  private isCreatingOrder = false;
  private readonly statusService = inject(StatusService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  constructor() {
    super(inject(DeliveryOrderUseCase));
  }
  public getState(): Signal<DeliveryOrderResponseState> {
    return this.stateResponse.asReadonly();
  }

  override setState(partialState: Partial<DeliveryOrderResponseState>): void {
    this.stateResponse.update((current) => ({
      ...current,
      ...partialState,
    }));
  }

  setLoading(loading: boolean) {
    this.setState({ isLoading: loading });
  }

  override reset() {
    this.stateResponse.set(this.initialResponseState);
  }

  // Add this method to access the stats
  getOrderStats(): DeliveryOrderStats | null {
    return this.orderStats();
  }

  public override getBlank(): DeliveryOrder {
    return {
      customer: {
        branchOfficeList: [],
      },
      deliveryZone: {},
      branchOffice: {
        contactPerson: {},
        neighborhood: {},
      },
      productOrders: [],
    };
  }

  public getBlankOrderBasic(): DeliveryOrderBasic {
    return {};
  }

  public override async update(entity: DeliveryOrder): Promise<DeliveryOrder> {
    let order: DeliveryOrder = await super.update(entity);
    this.updateOrderState(order);
    return order;
  }

  private getStatsFromResponse(
    response: DeliveryOrderResponse,
  ): DeliveryOrderStats {
    return {
      pendingCount: response.pendingCount ?? 0,
      productionCount: response.productionCount ?? 0,
      finishedCount: response.finishedCount ?? 0,
      deliveredCount: response.deliveredCount ?? 0,
      cancelledCount: response.cancelledCount ?? 0,
      pausedCount: response.pausedCount ?? 0,
    };
  }

  private getStatsFromOrder(response: DeliveryOrder): DeliveryOrderStats {
    return {
      pendingCount:
        response.productOrders?.filter(
          (order) => order.status?.name === 'PENDING',
        ).length || 0,
      productionCount:
        response.productOrders?.filter(
          (order) => order.status?.name === 'PRODUCTION',
        ).length || 0,
      finishedCount:
        response.productOrders?.filter(
          (order) => order.status?.name === 'FINISHED',
        ).length || 0,
      deliveredCount:
        response.productOrders?.filter(
          (order) => order.status?.name === 'DELIVERED',
        ).length || 0,
      cancelledCount:
        response.productOrders?.filter(
          (order) => order.status?.name === 'CANCELLED',
        ).length || 0,
      pausedCount:
        response.productOrders?.filter(
          (order) => order.status?.name === 'PAUSED',
        ).length || 0,
    };
  }

  public updateOrderState(
    orderResponse: DeliveryOrderResponse | DeliveryOrder,
  ) {
    if ('order' in orderResponse) {
      // Handle DeliveryOrderResponse case
      this.setState({
        order: orderResponse.order,
        ...this.getStatsFromResponse(orderResponse),
        isLoading: false,
        error: undefined,
      });
    } else {
      // Handle DeliveryOrder case
      this.setState({
        order: orderResponse,
        ...(this.getStatsFromOrder(orderResponse) ?? this.orderStats),
        isLoading: false,
        error: undefined,
      });
    }
  }

  public async findByIdResponse(
    id: number,
    options?: {
      includeDeleted?: boolean;
    },
  ): Promise<DeliveryOrderResponse> {
    try {
      const response = (await this.useCase.findByIdResponse(id, {
        includeDeleted: options?.includeDeleted ?? false,
        asPromise: true,
      })) as ApiResponse<DeliveryOrderResponse>;

      if (!response?.success || !response.data?.item) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.item;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  public async refreshOrderStateById(orderId: number): Promise<void> {
    const orderResponse = await this.findByIdResponse(orderId);
    this.updateOrderState(orderResponse);
  }

  /**
   * Sets up a delivery order view based on order ID and view type
   */
  public async setActiveDeliveryOrderView(orderId: number, typeView: string) {
    // Reset state first
    this.reset();

    // Set loading state
    this.setIsLoading(true);

    try {
      await this.refreshOrderStateById(orderId);

      // Determine target URL based on view type
      let targetURL: string[] = [URL_ORDERS];
      switch (typeView) {
        case SCREEN_TYPE_VIEW_PRODUCTION: {
          targetURL.push(URL_PRODUCTION, URL_PRODUCTION_VIEW);
          break;
        }
        case SCREEN_TYPE_VIEW_DISPATCH: {
          targetURL.push(URL_DISPATCH, URL_DISPATCH_VIEW);
          break;
        }
        case SCREEN_TYPE_EDIT: {
          targetURL.push(URL_COMMERCIAL, URL_COMMERCIAL_EDIT);
          break;
        }
      }

      // Navigate after state is updated
      await this.router.navigate(targetURL, {
        relativeTo: this.route.root,
        queryParams: { deliveryOrderId: orderId },
      });
    } catch (error) {
      console.error('Error in setIdDeliveryOrder:', error);
      this.reset();
      this.setError(
        error instanceof Error ? error.message : 'Error loading delivery order',
      );
    } finally {
      this.setIsLoading(false);
    }
  }

  public updateBranchOfficeInCurrentOrder(office: BranchOffice) {
    const current = this.stateResponse();
    if (current?.order) {
      this.setState({
        ...current,
        order: {
          ...current.order,
          branchOffice: office,
          deliveryZone:
            office.deliveryZone ?? office.neighborhood?.deliveryZone,
        },
      });
    }
  }

  public updateZoneInCurrentOrder(zone: DeliveryZoneBasic) {
    const current = this.stateResponse();
    if (current?.order) {
      this.setState({
        ...current,
        order: {
          ...current.order,
          deliveryZone: zone,
        },
      });
    }
  }

  public updateGeneralObservationsInCurrentOrder(observations: string) {
    const current = this.stateResponse();
    if (current?.order) {
      this.setState({
        ...current,
        order: {
          ...current.order,
          generalObservations: observations,
        },
      });
    }
  }

  public resetAllData() {
    this.reset();
    this.productService.reset();
  }

  private async createOrder(customerId: number): Promise<DeliveryOrder> {
    this.reset();
    this.setLoading(true);

    const response = (await this.useCase.nuevo(customerId, {
      asPromise: true,
    })) as ApiResponse<DeliveryOrder>;

    if (!response?.success || !response?.data?.item) {
      throw new Error(response.message ?? 'Invalid response from server');
    }

    const order = response.data.item;
    const { version, status, ...orderCleaned } = order;
    this.setState({
      order: orderCleaned,
      pendingCount: 0,
      productionCount: 0,
      finishedCount: 0,
      deliveredCount: 0,
      cancelledCount: 0,
      pausedCount: 0,
      isLoading: false,
      error: undefined,
    });

    return order;
  }

  private async navigateToOrderCreation(customerId: number): Promise<void> {
    const targetURL: string[] = [
      URL_ORDERS,
      URL_COMMERCIAL,
      URL_COMMERCIAL_CREATE,
    ];

    await this.router.navigate(targetURL, {
      relativeTo: this.route.root,
      queryParams: { customerId },
    });
  }

  public async createNewOrderFromCustomer(customerId: number): Promise<void> {
    if (this.isCreatingOrder) {
      return;
    }

    try {
      this.isCreatingOrder = true;
      await this.createOrder(customerId);
      await this.navigateToOrderCreation(customerId);
    } catch (error) {
      this.reset();
      this.setError('Error creating new delivery order');
      console.error('Failed to create delivery order:', error);
    } finally {
      this.isCreatingOrder = false;
    }
  }

  public getStatusByName(name: EStatus | undefined): Status | undefined {
    return this.statusService.getStatusByName(name);
  }

  public getStatusById(statusId: number): Status | undefined {
    return this.statusService.getStatusById(statusId);
  }

  async getOrdersForCustomerInvoicing(
    customerId: number,
    dateRange: DateRange,
    pagination: PaginationCriteria,
    isBilled?: boolean,
  ): Promise<DeliveryOrderResponse[]> {
    try {
      const response = (await this.useCase.getOrdersForCustomerInvoicing(
        customerId,
        dateRange,
        pagination,
        {
          asPromise: true,
          isBilled: isBilled,
        },
      )) as ApiResponse<DeliveryOrderResponse>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch orders');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in getOrdersForDateRangeInvoicing:', error);
      return [];
    }
  }
  async findByIdListAndDominantCustomer(
    ids: number[],
    sortOrders?: Sort[],
  ): Promise<DeliveryOrderResponse[]> {
    try {
      const response = (await this.useCase.findByIdListAndDominantCustomer(
        ids,
        sortOrders,
        { asPromise: true },
      )) as ApiResponse<DeliveryOrderResponse>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch orders');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in findByIdListAndDominantCustomer:', error);
      return [];
    }
  }

  async updateIsBilled(id: number, isBilled: boolean): Promise<DeliveryOrder> {
    try {
      const response = (await this.useCase.updateIsBilled(id, isBilled, {
        asPromise: true,
      })) as ApiResponse<DeliveryOrder>;

      if (!response?.success || !response.data?.item) {
        throw new Error(response?.message ?? 'Failed to update order');
      }

      return response.data.item;
    } catch (error) {
      console.error('Error in updateIsBilled:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  async updateBatchBillingStatus(
    ids: number[],
    isBilled: boolean,
  ): Promise<DeliveryOrder[]> {
    try {
      const response = (await this.useCase.updateBatchBillingStatus(
        ids,
        isBilled,
        {
          asPromise: true,
        },
      )) as ApiResponse<DeliveryOrder>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch orders');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in getOrdersForDateRangeInvoicing:', error);
      return [];
    }
  }
}
