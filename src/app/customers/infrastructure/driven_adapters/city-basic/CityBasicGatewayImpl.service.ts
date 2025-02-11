import { Injectable } from '@angular/core';
import { GenericNamedBasicGateway } from '../../../../generics/domain/gateway/GenericNamedBasicGateway';
import { GenericNamedBasicGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedBasicGatewayImpl';
import { CityBasic } from '../../../domain/models/CityBasic';

@Injectable({
  providedIn: 'root',
})
export class CityBasicGatewayImpl
  extends GenericNamedBasicGatewayImpl<CityBasic>
  implements GenericNamedBasicGateway<CityBasic>
{
  constructor() {
    super('/city-basic');
  }
}
