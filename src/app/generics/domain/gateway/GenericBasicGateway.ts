import { Observable } from 'rxjs';
import { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import { Sort } from '../../../shared/domain/models/pagination/Sort';
import { ApiResponse } from '../../dto/ApiResponse';
import { PaginationResponse } from '../../dto/PaginationResponse';
import { GenericBasicEntity } from '../model/GenericBasicEntity';
export abstract class GenericBasicGateway<T extends GenericBasicEntity> {
  // Find single entity
  abstract findById(
    id: number,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  // Find multiple entities by id list
  abstract findByIdIn(
    idList: number[],
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  // Find all entities with sorting
  abstract findAll(options?: {
    sortOrders?: Sort[];
    includeDeleted?: boolean;
    asPromise?: boolean;
  }): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  // Find paginated results
  abstract findAllPagination(
    pagination: PaginationCriteria,
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<PaginationResponse<T>> | Promise<PaginationResponse<T>>;
}
