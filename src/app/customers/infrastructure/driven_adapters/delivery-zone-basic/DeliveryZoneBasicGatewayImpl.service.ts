import { Injectable } from '@angular/core';
import { GenericNamedBasicGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedBasicGatewayImpl';
import { DeliveryZoneBasic } from '../../../domain/models/DeliveryZoneBasic';
import { DeliveryZoneBasicGateway } from '../../../domain/models/gateways/DeliveryZoneBasicGateway';

@Injectable({
  providedIn: 'root',
})
export class DeliveryZoneBasicGatewayImpl
  extends GenericNamedBasicGatewayImpl<DeliveryZoneBasic>
  implements DeliveryZoneBasicGateway
{
  constructor() {
    super('/delivery-zone-basic');
  }
}
