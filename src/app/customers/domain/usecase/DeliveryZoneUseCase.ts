import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { DeliveryZone } from '../models/DeliveryZone';
import { DeliveryZoneGateway } from '../models/gateways/DeliveryZoneGateway';

@Injectable({
  providedIn: 'root',
})
export class DeliveryZoneUseCase extends GenericNamedUseCase<
  DeliveryZone,
  DeliveryZoneGateway
> {
  constructor(protected override gateway: DeliveryZoneGateway) {
    super(gateway);
  }
}
