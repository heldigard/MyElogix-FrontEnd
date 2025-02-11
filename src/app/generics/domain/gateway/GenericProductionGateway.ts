import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericProduction } from '../model/GenericProduction';
import { GenericStatusGateway } from './GenericStatusGateway';

export abstract class GenericProductionGateway<
  T extends GenericProduction,
> extends GenericStatusGateway<T> {
  abstract advanceOrderStatus(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  abstract batchAdvanceOrderStatus(
    idList: number[],
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  abstract toggleCancelled(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  abstract togglePaused(
    id: number,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;
}
