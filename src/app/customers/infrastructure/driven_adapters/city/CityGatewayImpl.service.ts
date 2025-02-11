import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { City } from '../../../domain/models/City';
import { CityGateway } from '../../../domain/models/gateways/CityGateway';

@Injectable({
  providedIn: 'root',
})
export class CityGatewayImpl
  extends GenericNamedGatewayImpl<City>
  implements CityGateway
{
  constructor() {
    super('/city');
  }
}
