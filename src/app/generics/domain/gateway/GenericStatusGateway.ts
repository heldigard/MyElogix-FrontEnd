import { Observable } from 'rxjs';
import { EStatus } from '../../../delivery-orders/domain/models/EStatus';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericStatus } from '../model/GenericStatus';
import { GenericGateway } from './GenericGateway';

export abstract class GenericStatusGateway<
  T extends GenericStatus,
> extends GenericGateway<T> {
  abstract updateStatus(
    id: number,
    status: EStatus,
    options?: { asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;
}
