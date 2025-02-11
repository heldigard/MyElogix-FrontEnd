import { Observable } from 'rxjs';
import { EStatus } from '../../../delivery-orders/domain/models/EStatus';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericStatusGateway } from '../gateway/GenericStatusGateway';
import { GenericStatus } from '../model/GenericStatus';
import { GenericUseCase } from './GenericUseCase';

export abstract class GenericStatusUseCase<
  T extends GenericStatus,
  G extends GenericStatusGateway<T>,
> extends GenericUseCase<T, G> {
  protected constructor(protected override readonly gateway: G) {
    super(gateway);
  }
  updateStatus(
    id: number,
    status: EStatus,
    options?: {
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.updateStatus(id, status, options);
  }
}
