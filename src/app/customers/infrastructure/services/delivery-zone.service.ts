import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { DeliveryZone } from '../../domain/models/DeliveryZone';
import { DeliveryZoneGateway } from '../../domain/models/gateways/DeliveryZoneGateway';
import { DeliveryZoneUseCase } from '../../domain/usecase/DeliveryZoneUseCase';

@Injectable({
  providedIn: 'root',
})
export class DeliveryZoneService extends GenericNamedService<
  DeliveryZone,
  DeliveryZoneGateway,
  DeliveryZoneUseCase
> {
  constructor() {
    super(inject(DeliveryZoneUseCase));
  }
}
