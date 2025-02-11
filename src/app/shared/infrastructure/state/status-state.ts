import type { Status } from '../../../delivery-orders/domain/models/Status';

export interface StatusState {
  statusList: Status[];
  isLoading: boolean;
  error?: string;
}
