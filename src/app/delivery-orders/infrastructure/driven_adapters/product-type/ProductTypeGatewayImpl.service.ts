import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { BooleanDTO } from '../../../../shared/domain/models/BooleanDTO';
import { ProductType } from '../../../domain/models/ProductType';
import { ProductTypeGateway } from '../../../domain/models/gateways/ProductTypeGateway';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeGatewayImpl
  extends GenericNamedGatewayImpl<ProductType>
  implements ProductTypeGateway
{
  constructor() {
    super('/product-type');
  }

  updateCategory(name: string, id: number): Observable<number> {
    const endpoint = this.localEndpoint + '/update';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('name', name);
    queryParams.append('id', id);

    return this.httpClient.put<number>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }

  updateIsMeasurable(booleanDTO: BooleanDTO): Observable<number> {
    const endpoint = this.localEndpoint + '/update/isMeasurable';

    return this.httpClient.put<number>(this.apiURL + endpoint, booleanDTO);
  }

  findByCategory(
    name: string,
    isDeleted?: boolean,
  ): Observable<Array<ProductType>> {
    const endpoint = this.localEndpoint + '/find/category';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('name', name);
    if (isDeleted) queryParams = queryParams.append('isDeleted', isDeleted);

    return this.httpClient.get<Array<ProductType>>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }
}
