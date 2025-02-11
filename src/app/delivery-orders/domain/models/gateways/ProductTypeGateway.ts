import { Observable } from 'rxjs';
import { GenericNamedGateway } from '../../../../generics/domain/gateway/GenericNamedGateway';
import { ProductType } from '../ProductType';

export abstract class ProductTypeGateway extends GenericNamedGateway<ProductType> {
  abstract findByCategory(
    name: string,
    isDeleted?: boolean,
  ): Observable<Array<ProductType>>;
}
