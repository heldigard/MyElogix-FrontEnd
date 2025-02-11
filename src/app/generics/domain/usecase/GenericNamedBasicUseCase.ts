import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericNamedBasicGateway } from '../gateway/GenericNamedBasicGateway';
import { GenericNamedBasic } from '../model/GenericNamedBasic';
import { GenericBasicUseCase } from './GenericBasicUseCase';

export abstract class GenericNamedBasicUseCase<
  T extends GenericNamedBasic,
  G extends GenericNamedBasicGateway<T>,
> extends GenericBasicUseCase<T, G> {
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

  existsByName(
    name: string,
    options?: {
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.existsByName(name, options);
  }
}
