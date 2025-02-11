import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericEntity } from '../model/GenericEntity';
import { GenericGateway } from './GenericGateway';

/**
 * Generic gateway interface that combines named and basic entity operations
 * @typeParam T - Entity type that extends GenericEntity
 */
export abstract class GenericNamedGateway<
  T extends GenericEntity,
> extends GenericGateway<T> {
  abstract findByName(
    name: string,
    options?: {
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;

  /**
   * Checks if an entity exists by name
   * @param name Name to check
   * @param includeDeleted Include deleted entities in search
   * @returns true if an entity with the given name exists
   */
  abstract deleteByName(
    name: string,
    options?: {
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;
}
