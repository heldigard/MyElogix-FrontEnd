import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { DeliveryZone } from '../../../domain/models/DeliveryZone';
import { DeliveryZoneGateway } from '../../../domain/models/gateways/DeliveryZoneGateway';

@Injectable({
  providedIn: 'root',
})
export class DeliveryZoneGatewayImpl
  extends GenericNamedGatewayImpl<DeliveryZone>
  implements DeliveryZoneGateway
{
  constructor() {
    super('/delivery-zone');
  }
}
