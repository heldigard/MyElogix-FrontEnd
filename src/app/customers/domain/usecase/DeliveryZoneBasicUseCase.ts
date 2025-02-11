import { Injectable } from '@angular/core';
import { GenericNamedBasicUseCase } from '../../../generics/domain/usecase/GenericNamedBasicUseCase';
import { DeliveryZoneBasic } from '../models/DeliveryZoneBasic';
import { DeliveryZoneBasicGateway } from '../models/gateways/DeliveryZoneBasicGateway';

@Injectable({
  providedIn: 'root',
})
export class DeliveryZoneBasicUseCase extends GenericNamedBasicUseCase<
  DeliveryZoneBasic,
  DeliveryZoneBasicGateway
> {
  constructor(protected override gateway: DeliveryZoneBasicGateway) {
    super(gateway);
  }
}
