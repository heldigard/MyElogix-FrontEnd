import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_BILLING, URL_BILLING_VIEW, URL_ORDERS } from '@globals';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeliveryOrderBasic } from '../../../../../delivery_order/domain/model/DeliveryOrderBasic';
import { CustomerOrdersSummaryDTO } from '../../../../../delivery_order/dto/CustomerOrdersSummaryDTO';
import { DeliveryOrderResponse } from '../../../../../delivery_order/dto/DeliveryOrderResponse';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { BillingDeliveryOrderState } from '../../../../../delivery_order/infrastructure/state/billing-delivery-order-state';
import { DateRange } from '../../../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../../../../shared/domain/models/pagination/Sort';
import { getDateRangeFromDay } from '../../../../shared';

@Injectable({
  providedIn: 'root',
})
export class BillingDeliveryOrderService {
  private readonly initialState: BillingDeliveryOrderState = {
    orderList: [],
    selectedOrders: [],
    isProcessing: false,
    isLoading: false,
    error: undefined,
    isActiveBillOrderTab: false,
  };

  private state = new BehaviorSubject<BillingDeliveryOrderState>(
    this.initialState,
  );

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {}

  // 4. Add state management methods
  getState(): Observable<BillingDeliveryOrderState> {
    return this.state.asObservable();
  }

  setState(newState: Partial<BillingDeliveryOrderState>) {
    this.state.next({
      ...this.state.value,
      ...newState,
    });
  }

  // 5. Add getter methods for specific state slices
  private getSelectedOrders(): DeliveryOrderBasic[] {
    return this.state.value.selectedOrders;
  }

  private getOrderList(): DeliveryOrderResponse[] {
    return this.state.value.orderList;
  }

  // 6. Add methods to update specific parts of state
  setOrderList(orders: DeliveryOrderResponse[]) {
    this.setState({ orderList: orders });
  }

  setSelectedOrders(orders: DeliveryOrderBasic[]) {
    this.setState({ selectedOrders: orders });
  }

  setLoading(isLoading: boolean) {
    this.setState({ isLoading });
  }

  setError(error: string | undefined) {
    this.setState({ error });
  }

  // 7. Add reset method
  reset() {
    this.state.next(this.initialState);
  }

  // 8. Update your existing methods to use new state management
  async processDeliveryOrders(
    customerOrdersSummary: CustomerOrdersSummaryDTO,
  ): Promise<void> {
    try {
      this.setState({ isLoading: true });

      await this.setAllDeliveryOrdersByCustomer(customerOrdersSummary);
      await this.router.navigate([URL_ORDERS, URL_BILLING, URL_BILLING_VIEW], {
        relativeTo: this.route.root,
      });
    } catch (error) {
      this.setState({
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  setOrdersOneCustomerToBill(): void {
    // Usar el state en lugar del BehaviorSubject
    const selectedOrders = this.state.value.selectedOrders;

    if (!selectedOrders.length) {
      return;
    }

    const deliveryOrderIdList = selectedOrders.map((order) => order.id!);

    this.setState({
      orderList: [],
      isProcessing: true,
    });

    this.setListDeliveryOrdersByOneCustomer(deliveryOrderIdList)
      .then(() => {
        return this.router.navigate(
          [URL_ORDERS, URL_BILLING, URL_BILLING_VIEW],
          {
            relativeTo: this.route.root,
          },
        );
      })
      .then(() => {
        // Actualizar selectedOrders a través del state
        this.setState({
          selectedOrders: [],
          isProcessing: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          isProcessing: false,
        });
      });
  }

  private createSortOrders(): Sort[] {
    return [
      {
        direction: 'ASC',
        property: 'createdAt',
      },
      {
        direction: 'ASC',
        property: 'id',
      },
    ];
  }

  private async setAllDeliveryOrdersByCustomer(
    customerOrderSummary: CustomerOrdersSummaryDTO,
  ): Promise<void> {
    try {
      // Set loading state
      this.setState({
        isLoading: true,
        error: undefined,
        orderList: [], // Clear previous orders while loading
      });

      // Create date range and pagination
      const dateRange: DateRange = getDateRangeFromDay(
        customerOrderSummary.day,
      );
      const pagination: PaginationCriteria = {
        page: 0,
        pageSize: 100,
        sortOrders: this.createSortOrders(),
      };
      // Fetch orders
      const orders = await this.orderService.getOrdersForCustomerInvoicing(
        customerOrderSummary.customerId,
        dateRange,
        pagination,
        customerOrderSummary.isBilled,
      );

      // Handle response
      if (orders && orders.length > 0) {
        // Update state with new orders
        this.setState({
          orderList: orders,
          error: undefined,
          isLoading: false,
        });

        // Set first order as current in delivery order service
        this.orderService.updateOrderState(orders[0].order);
      } else {
        // Update state for empty response
        this.setState({
          orderList: [],
          error: 'No orders found',
          isLoading: false,
        });
      }
    } catch (error) {
      // Handle error state
      this.setState({
        orderList: [],
        error: 'Error loading delivery orders',
        isLoading: false,
      });
      console.error('Error in setAllDeliveryOrdersByCustomer:', error);
    }
  }

  /**
   * Sets the delivery order list to bill using the customer with more frequency in the list
   */
  private async setListDeliveryOrdersByOneCustomer(ids: number[]) {
    try {
      const sortOrders = this.createSortOrders();
      const orders: DeliveryOrderResponse[] =
        await this.orderService.findByIdListAndDominantCustomer(
          ids,
          sortOrders,
        );

      if (orders && orders.length > 0) {
        // Update state with fetched orders
        this.setState({
          orderList: orders,
          error: undefined,
        });

        // Set first order as current
        this.orderService.updateOrderState(orders[0].order);
      } else {
        this.setState({
          orderList: [],
          error: 'No orders found for this customer',
        });
      }
    } catch (error) {
      // Handle errors appropriately
      this.setState({
        orderList: [],
        error: 'Error loading orders for customer',
        isProcessing: false,
      });
      console.error('Error in setListDeliveryOrdersByOneCustomer:', error);
    } finally {
      // Ensure processing state is reset
      this.setState({
        isProcessing: false,
      });
    }
  }
}
