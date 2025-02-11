import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericBasicEntity } from '../model/GenericBasicEntity';
import { GenericBasicGateway } from './GenericBasicGateway';

export abstract class GenericNamedBasicGateway<
  T extends GenericBasicEntity,
> extends GenericBasicGateway<T> {
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
  abstract existsByName(
    name: string,
    options?: {
      includeDeleted?: boolean;
      asPromise?: boolean;
    },
  ): Observable<ApiResponse<T>> | Promise<ApiResponse<T>>;
}
