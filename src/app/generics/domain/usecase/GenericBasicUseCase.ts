import { Observable } from 'rxjs';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../../shared/domain/models/pagination/Sort';
import { ApiResponse } from '../../dto/ApiResponse';
import { PaginationResponse } from '../../dto/PaginationResponse';
import { GenericBasicGateway } from '../gateway/GenericBasicGateway';
import { GenericBasicEntity } from '../model/GenericBasicEntity';

export abstract class GenericBasicUseCase<
  T extends GenericBasicEntity,
  G extends GenericBasicGateway<T>,
> {
  protected constructor(protected readonly gateway: G) {}

  findById(
    id: number,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.findById(id, options);
  }

  findByIdIn(
    idList: number[],
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.findByIdIn(idList, options);
  }

  findAll(options?: {
    sortOrders?: Sort[];
    includeDeleted?: boolean;
    asPromise?: boolean;
  }): Observable<ApiResponse<T>> | Promise<ApiResponse<T>> {
    return this.gateway.findAll(options);
  }

  findAllPagination(
    pagination: PaginationCriteria,
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<PaginationResponse<T>> | Promise<PaginationResponse<T>> {
    return this.gateway.findAllPagination(pagination, options);
  }
}
