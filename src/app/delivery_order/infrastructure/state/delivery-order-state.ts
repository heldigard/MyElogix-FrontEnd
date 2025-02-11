import type { DeliveryOrder } from '../../domain/model/DeliveryOrder';
import type { DeliveryOrderResponse } from '../../dto/DeliveryOrderResponse';
import type { GenericBasicState } from '../../../generics/insfrastructure/state/GenericBasicState';

export interface DeliveryOrderResponseState
  extends DeliveryOrderResponse,
    GenericBasicState<DeliveryOrder> {
  items: DeliveryOrder[];
  currentItem: DeliveryOrder | undefined;
  rowCount: number;
  currentPage: number;
  pagesCount: number;
  error: string | undefined;
  isLoading: boolean;
  isFormValid: boolean;
  isObservationsValid: boolean;
}
