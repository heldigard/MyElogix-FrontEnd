import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericNamedGateway } from '../gateway/GenericNamedGateway';
import { GenericNamed } from '../model/GenericNamed';
import { GenericUseCase } from './GenericUseCase';

export abstract class GenericNamedUseCase<
  T extends GenericNamed,
  G extends GenericNamedGateway<T>,
> extends GenericUseCase<T, G> {
  protected constructor(protected override readonly gateway: G) {
    super(gateway);
  }

  findByName(
    name: string,
    options?: {
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.findByName(name, options);
  }

  deleteByName(
    name: string,
    options?: {
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.deleteByName(name, options);
  }
}
