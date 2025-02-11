import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericProductionGateway } from '../gateway/GenericProductionGateway';
import { GenericProduction } from '../model/GenericProduction';
import { GenericStatusUseCase } from './GenericStatusUseCase';

export abstract class GenericProductionUseCase<
  T extends GenericProduction,
  G extends GenericProductionGateway<T>,
> extends GenericStatusUseCase<T, G> {
  protected constructor(protected override readonly gateway: G) {
    super(gateway);
  }
  advanceOrderStatus(
    id: number,
    options?: {
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.advanceOrderStatus(id, options);
  }

  batchAdvanceOrderStatus(
    idList: number[],
    options?: {
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.batchAdvanceOrderStatus(idList, options);
  }
  toggleCancelled(
    id: number,
    options?: {
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.toggleCancelled(id, options);
  }

  togglePaused(
    id: number,
    options?: {
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.togglePaused(id, options);
  }
}
