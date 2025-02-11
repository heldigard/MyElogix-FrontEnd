import type { DeliveryOrderBasic } from '../../domain/model/DeliveryOrderBasic';
import type { DeliveryOrderResponse } from '../../dto/DeliveryOrderResponse';

export interface BillingDeliveryOrderState {
  orderList: DeliveryOrderResponse[];
  selectedOrders: DeliveryOrderBasic[];
  isLoading: boolean;
  isProcessing: boolean;
  error?: string;
  isActiveBillOrderTab: boolean;
}
